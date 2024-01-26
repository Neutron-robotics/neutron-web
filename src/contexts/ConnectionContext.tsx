import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Node } from "reactflow";
import { IRobot, defaultRobot } from "../api/models/robot.model";
import { ConnectorGraph, FlowGraph, RosContext, makeConnectionContext } from "neutron-core";
import * as robotStartUtils from "../utils/robotStartUtils";
import * as connectionApi from "../api/connection";

export enum RobotConnectionStep {
    Start,
    CompilingGraph,
    SpawningContext,
    SpawningParts,
    Done
}

export interface IConnectionSessionBuilderOptions {
    partsIdToConnect?: string[]
    onConnectionProgress?: (step: RobotConnectionStep) => void
    onPartConnect?: (partId: string) => void
}

export interface IConnectionSession {
    connectionId: string
    nodes: Node[]
    robot: IRobot
    graphs: (ConnectorGraph | FlowGraph)[]
    context: RosContext
}

export type IConnectionSessionStore = Record<string, IConnectionSession>

type ContextProps = {
    connections: IConnectionSessionStore
    setConnections: Dispatch<SetStateAction<IConnectionSessionStore>>
    makeConnection: (robot: IRobot, graphs: (ConnectorGraph | FlowGraph)[], opts: IConnectionSessionBuilderOptions) => Promise<void>
}

const ConnectionContext = createContext<ContextProps>({} as any)

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [connections, setConnections] = useState<IConnectionSessionStore>({
        "totototooto": {
            nodes: [],
            context: null as any,
            robot: defaultRobot,
            graphs: [],
            connectionId: 'totototooto'
        }
    })

    const makeConnection = async (robot: IRobot, graphs: (ConnectorGraph | FlowGraph)[], opts: IConnectionSessionBuilderOptions) => {
        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.CompilingGraph)

        const startPromise = connectionApi.connectRobotAndCreateConnection(robot._id, opts.partsIdToConnect)

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.SpawningContext)
        await robotStartUtils.waitForContextToSpawn(robot._id, 500, 30_000)

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.SpawningParts)
        const partsConnectionPromise = robotStartUtils.waitForProcessesToSpawn(
            robot._id,
            opts.partsIdToConnect ?? robot.parts.map(e => e._id),
            500,
            30_000)
        for (const promise of partsConnectionPromise) {
            promise.then((id) => {
                opts.onPartConnect && opts.onPartConnect(id)
                return
            })
        }
        await Promise.all(partsConnectionPromise)
        const connectionInfos = await startPromise

        const context = makeConnectionContext(robot.context, {
            hostname: connectionInfos.hostname,
            port: connectionInfos.port,
            clientId: connectionInfos.registerId,
        })
        await context.connect()

        setConnections({
            ...connections,
            [connectionInfos.connectionId]: {
                connectionId: connectionInfos.connectionId,
                nodes: [],
                robot,
                graphs,
                context: context as RosContext
            }
        })

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.Done)
    }

    return (
        <ConnectionContext.Provider value={{ connections, setConnections, makeConnection }}>
            {children}
        </ConnectionContext.Provider>
    );
}

interface ConnectionContextHook {
    nodes: Node[]
    robot: IRobot
    context: RosContext
    setNodes: (nodes: Node[]) => void
    addNode: (node: Node) => void
    removeNode: (nodeId: string) => void
}

export const useConnection = (connectionId: string): ConnectionContextHook => {
    const { connections, setConnections } = useContext(ConnectionContext)

    const setNodes = (nodes: Node[]) => {
        setConnections((prev) => ({
            ...prev,
            [connectionId]: {
                ...prev[connectionId],
                nodes
            }
        }))
    }

    const addNode = (node: Node) => {
        setConnections((prev) => ({
            ...prev,
            [connectionId]: {
                ...prev[connectionId],
                nodes: [
                    ...prev[connectionId].nodes,
                    node
                ]
            }
        }))
    }

    const removeNode = (nodeId: string) => {
        setConnections((prev) => ({
            ...prev,
            [connectionId]: {
                ...prev[connectionId],
                nodes: prev[connectionId].nodes.filter(e => e.id !== nodeId),
            }
        }))
    }

    return {
        nodes: connections[connectionId]?.nodes ?? [],
        robot: connections[connectionId]?.robot ?? defaultRobot,
        context: connections[connectionId]?.context,
        setNodes,
        addNode,
        removeNode
    }
}