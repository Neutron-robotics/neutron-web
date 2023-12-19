import { ReactNode, createContext, useContext, useState } from "react"
import { ConnectorGraph, FlowGraph, NeutronEdgeDB, NeutronGraphType, NeutronNodeDB, NodeMessage } from "neutron-core"
import { sleep } from "../utils/time"

type ContextProps = {
    makeNeutronGraph: (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        initialTimeout: number
    ) => void
    runNode: (id: string, message?: NodeMessage) => void
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

    const makeNeutronGraph = async (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        initialTimeout: number = 1000
    ) => {
        let graph;

        setGraphStatus("compiling");

        await sleep(initialTimeout);

        if (type === "Connector") {
            graph = new ConnectorGraph(nodes, edges);
        } else if (type === "Flow") {
            graph = new FlowGraph(nodes, edges);
        }

        if (!graph) throw new Error("Could not create the neutron graph");

        setGraph(graph);
        setGraphStatus("ready");
        return graph;
    };

    const runNode = async (id: string, message?: NodeMessage) => {
        if (!graph) throw new Error("No graph loaded");

        const node = graph.getNodeById(id);
        if (!node) throw new Error(`No node found with id ${id}`);

        setGraphStatus("running");
        await graph.run(node, message);
        setGraphStatus("ready");
    };

    const unloadGraph = () => {
        setGraph(undefined);
        setGraphStatus("unloaded");
    };
    return (
        <NeutronGraphContext.Provider value={
            {
                makeNeutronGraph,
                runNode,
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