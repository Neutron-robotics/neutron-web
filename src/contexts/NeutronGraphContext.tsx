import { ReactNode, createContext, useContext, useRef, useState } from "react"
import { ConnectorGraph, FlowGraph, IConnectionContext, NeutronEdgeDB, NeutronGraphType, NeutronNodeDB, NodeMessage, makeConnectionContext } from "neutron-core"
import { sleep } from "../utils/time"
import { useAlert } from "./AlertContext"
import * as connectionApi from "../api/connection"
import * as robotApi from "../api//robot";
import { IRobot } from "../api/models/robot.model"
import { ConnectionRegistrationInfos } from "../api/models/connection.model"

interface RobotConnectionInfos extends ConnectionRegistrationInfos {
    robotId: string
}

type ContextProps = {
    makeNeutronGraph: (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        robot?: IRobot,
        initialTimeout?: number
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
    const robotConnectionInfos = useRef<RobotConnectionInfos | undefined>()
    const alert = useAlert()

    const makeNeutronGraph = async (
        type: NeutronGraphType,
        nodes: NeutronNodeDB[],
        edges: NeutronEdgeDB[],
        robot?: IRobot,
        initialTimeout: number = 1000
    ) => {
        let graph: ConnectorGraph | FlowGraph | undefined;

        setGraphStatus("compiling");

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

        if (graph.requireRosContext) {
            if (!robot) {
                alert.error('A robot is required for running this graph')
                setGraphStatus('unloaded')
                return
            }
            try {
                const context = await createRobotConnection(robot)
                graph.useContext(context)
                alert.success("Connected to the robot")
            }
            catch (err: any) {
                alert.error(`Connection failed: ${err.message}`)
                setGraphStatus('unloaded')
                return
            }
        }
        else {
            // Users likes when it loads
            await sleep(initialTimeout);
        }
        const inputNodes = graph.getInputNodes()
        for (const inputNode of inputNodes) {
            inputNode.ProcessingBegin.on(handleInputNodeStartRunning)
            inputNode.ProcessingBegin.on(handleInputNodeFinishedRunning)
        }

        setGraph(graph);
        setGraphStatus("ready");
        return graph;
    };

    const createRobotConnection = async (robot: IRobot): Promise<IConnectionContext> => {
        const connectionInfos = await connectionApi.connectRobotAndCreateConnection(robot._id)
        const context = makeConnectionContext(robot.context, {
            hostname: connectionInfos.hostname,
            port: connectionInfos.port,
            clientId: connectionInfos.registerId,
        })
        await context.connect()
        robotConnectionInfos.current = {
            ...connectionInfos,
            robotId: robot._id
        }
        return context
    }

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

    const unloadGraph = async () => {
        const inputNodes = graph?.getInputNodes() ?? []
        for (const inputNode of inputNodes) {
            inputNode.ProcessingBegin.offAll()
            inputNode.ProcessingBegin.offAll()
        }
        if (robotConnectionInfos.current !== undefined) {
            try {
                await connectionApi.close(robotConnectionInfos.current.connectionId)
            }
            catch {
                alert.error("Failed to close the connection")
            }

            try {
                await robotApi.stop(robotConnectionInfos.current.robotId)
            }
            catch {
                alert.error("Failed to stop the robot")
            }
        }
        setGraph(undefined);
        robotConnectionInfos.current = undefined
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