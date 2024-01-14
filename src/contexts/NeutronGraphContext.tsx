import { ReactNode, createContext, useContext, useState } from "react"
import { ConnectorGraph, FlowGraph, NeutronEdgeDB, NeutronGraphType, NeutronNodeDB, NodeMessage } from "neutron-core"
import { sleep } from "../utils/time"
import { useAlert } from "./AlertContext"

type ContextProps = {
    makeNeutronGraph: (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        initialTimeout: number
    ) => Promise<FlowGraph | ConnectorGraph | undefined>
    runInputNode: (id: string, message?: NodeMessage) => void
    unloadGraph: () => void
    graph: ConnectorGraph | FlowGraph | undefined
    graphStatus: NeutronGraphStatus
}

export type NeutronGraphStatus =
    | "unloaded"
    | "compiling"
    | "stopped"
    | "ready"
    | "running";

export type NeutronNodeRunStatus = 'pending' | 'running' | 'completed'

export const NeutronGraphContext = createContext<ContextProps>({} as ContextProps)

export const NeutronGraphProvider = ({ children }: { children: ReactNode }) => {
    const [graph, setGraph] = useState<ConnectorGraph | FlowGraph | undefined>();
    const [graphStatus, setGraphStatus] = useState<NeutronGraphStatus>("unloaded");
    const alert = useAlert()

    const makeNeutronGraph = async (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        initialTimeout: number = 1000
    ) => {
        let graph: ConnectorGraph | FlowGraph | undefined;

        setGraphStatus("compiling");

        await sleep(initialTimeout);

        try {
            if (type === "Connector") {
                graph = new ConnectorGraph(nodes, edges);
            } else if (type === "Flow") {
                graph = new FlowGraph(nodes, edges);
            }
        }
        catch (err: any) {
            alert.error(err.message)
            setGraphStatus('unloaded')
        }
        if (!graph) return

        setGraph(graph);
        setGraphStatus("ready");

        const inputNodes = graph.getInputNodes()
        for (const inputNode of inputNodes) {
            inputNode.ProcessingBegin.on(handleInputNodeStartRunning)
            inputNode.ProcessingBegin.on(handleInputNodeFinishedRunning)
        }
        return graph;
    };

    const handleInputNodeStartRunning = () => {
        setGraphStatus("running");
    }

    const handleInputNodeFinishedRunning = () => {
        setGraphStatus("ready");
    }

    const runInputNode = async (id: string, message?: NodeMessage) => {
        if (!graph) throw new Error("No graph loaded");

        await graph.runInputNode(id, message);
    };

    const unloadGraph = () => {
        const inputNodes = graph?.getInputNodes() ?? []
        for (const inputNode of inputNodes) {
            inputNode.ProcessingBegin.offAll()
            inputNode.ProcessingBegin.offAll()
        }
        setGraph(undefined);
        setGraphStatus("unloaded");
    };
    return (
        <NeutronGraphContext.Provider value={
            {
                makeNeutronGraph,
                runInputNode,
                unloadGraph,
                graph,
                graphStatus
            }
        }>
            {children}
        </NeutronGraphContext.Provider>
    )
}

export const useNeutronGraph = () => {
    const context = useContext(NeutronGraphContext);
    if (context === undefined) {
        throw new Error("useNeutronGraph must be used within a NeutronGraphProvider");
    }
    return context;
}