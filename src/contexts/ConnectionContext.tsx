import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Node } from "reactflow";
import { IRobot, defaultRobot } from "../api/models/robot.model";
import { BaseNode, INodeBuilder, RosContext, makeConnectionContext } from "@neutron-robotics/neutron-core";
import { INeutronGraph } from "../api/models/graph.model";
import * as connectionApi from '../api/connection'
import * as robotApi from '../api/robot'
import * as robotStartUtils from '../utils/robotStartUtils'
import OperationalConnectorGraph from "../utils/ConnectorGraph";
import { useShortPolling } from "../components/controls/useShortPolling";
import { INeutronConnectionDTO } from "../api/models/connection.model";

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
    graphs: OperationalConnectorGraph[]
    context: RosContext
    connected: boolean
}

export type IConnectionSessionStore = Record<string, IConnectionSession>

type ContextProps = {
    connections: IConnectionSessionStore
    closedConnections: INeutronConnectionDTO[]
    setConnections: Dispatch<SetStateAction<IConnectionSessionStore>>
    setClosedConnection: Dispatch<SetStateAction<INeutronConnectionDTO[]>>
    makeConnection: (robot: IRobot, graphs: INeutronGraph[], opts: IConnectionSessionBuilderOptions) => Promise<string>
    joinConnection: (connectionId: string, robot: IRobot, graphs: INeutronGraph[], opts: IConnectionSessionBuilderOptions) => Promise<string>
}

export const ConnectionContext = createContext<ContextProps>({} as any)

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [connections, setConnections] = useState<IConnectionSessionStore>({})
    const [closedConnections, setClosedConnection] = useState<INeutronConnectionDTO[]>([])

    useShortPolling(10_000, () => connectionApi.getMyConnections('active'), async (connections: INeutronConnectionDTO[]) => {
        const fetchedConnections = await Promise.all(connections.map(async e => {
            const robot = await robotApi.getRobot(e.robot as string)
            return {
                robot,
                connection: e
            }
        }))
        setConnections((prev) => {
            const newPrevConnections: IConnectionSessionStore = Object.entries(prev).reduce<IConnectionSessionStore>((acc, [key, obj]) => {
                if (obj.connected) {
                    acc[key] = obj;
                }

                if (!fetchedConnections.find(e => e.connection._id === obj.connectionId)) {
                    console.log(`${obj.connectionId} HAS DISCONNECTED AKRT`)
                    connectionApi.getById(obj.connectionId).then((connection) => {
                        if (connection.closedAt)
                            setClosedConnection(prev => [...prev, connection])
                    })
                }
                return acc;
            }, {});

            const otherConnections: IConnectionSessionStore = fetchedConnections.reduce<IConnectionSessionStore>((acc, cur) => {
                if (newPrevConnections[cur.connection._id]) {
                    return acc
                }

                const inactiveConnection: IConnectionSession = {
                    connectionId: cur.connection._id,
                    nodes: [],
                    robot: cur.robot,
                    graphs: [],
                    connected: false,
                    context: undefined as any
                }
                return { ...acc, [cur.connection._id]: inactiveConnection }
            }, {})

            return { ...newPrevConnections, ...otherConnections }
        })
    })

    const makeConnection = async (robot: IRobot, graphs: INeutronGraph[], opts: IConnectionSessionBuilderOptions) => {
        if (opts.partsIdToConnect)
            robot.parts = robot.parts.filter(e => opts.partsIdToConnect!.includes(e._id))

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.CompilingGraph)
        const connectorGraphs = graphs.map(graph => new OperationalConnectorGraph(graph.nodes, graph.edges, graph.robot, graph.part ?? ''))

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.SpawningContext)
        const startPromise = connectionApi.connectRobotAndCreateConnection(robot._id, opts.partsIdToConnect)
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

        connectorGraphs.forEach(graph => graph.useContext(context))

        setConnections({
            ...connections,
            [connectionInfos.connectionId]: {
                connectionId: connectionInfos.connectionId,
                nodes: [],
                robot,
                graphs: connectorGraphs,
                context: context as RosContext,
                connected: true
            }
        })

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.Done)

        return connectionInfos.connectionId
    }

    const joinConnection = async (connectionId: string, robot: IRobot, graphs: INeutronGraph[], opts: IConnectionSessionBuilderOptions): Promise<string> => {
        if (opts.partsIdToConnect)
            robot.parts = robot.parts.filter(e => opts.partsIdToConnect!.includes(e._id))

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.CompilingGraph)
        const connectorGraphs = graphs.map(graph => new OperationalConnectorGraph(graph.nodes, graph.edges, graph.robot, graph.part ?? ''))

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.SpawningContext)

        const connectionInfos = await connectionApi.join(connectionId)
        const context = makeConnectionContext(robot.context, {
            hostname: connectionInfos.hostname,
            port: connectionInfos.port,
            clientId: connectionInfos.registerId,
        })
        await context.connect()

        connectorGraphs.forEach(graph => graph.useContext(context))

        setConnections({
            ...connections,
            [connectionInfos.connectionId]: {
                connectionId: connectionInfos.connectionId,
                nodes: [],
                robot,
                graphs: connectorGraphs,
                context: context as RosContext,
                connected: true
            }
        })

        opts.onConnectionProgress && opts.onConnectionProgress(RobotConnectionStep.Done)

        return connectionId
    }

    return (
        <ConnectionContext.Provider value={{ connections, closedConnections, setConnections, setClosedConnection, makeConnection, joinConnection }}>
            {children}
        </ConnectionContext.Provider>
    );
}

interface ConnectionContextHook {
    nodes: Node[]
    robot: IRobot
    context: RosContext
    connectors: OperationalConnectorGraph[],
    connected: boolean,
    closedConnection: INeutronConnectionDTO | undefined,
    setNodes: (nodes: Node[]) => void
    addNode: (node: Node) => void
    removeNode: (nodeId: string) => void
    getRelatedNodes: <TNode extends BaseNode, >(nodeType: {
        new(builder: INodeBuilder<any>): TNode;
    }, partId: string) => TNode[]
    quitConnection: (close?: boolean) => Promise<void>
    quitClosedConnection: () => void
}

export const useConnection = (connectionId: string): ConnectionContextHook => {
    const { connections, closedConnections, setConnections, setClosedConnection } = useContext(ConnectionContext)

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

    const getRelatedNodes = <TNode extends BaseNode,>(nodeType: {
        new(builder: INodeBuilder<any>): TNode;
    }, partId: string): TNode[] => {
        return connections[connectionId]?.graphs
            .filter(e => e.partId === partId)
            .reduce((acc: TNode[], cur: OperationalConnectorGraph) => {
                const graphNodes = cur.findNodeByType(nodeType)
                return [
                    ...acc,
                    ...graphNodes
                ]
            }, [])
    }

    const quitConnection = async (close?: boolean) => {
        const context = connections[connectionId]?.context
        if (!context) {
            console.log("No context found when attempting to quit ", connectionId)
            return
        }

        context.quit()
        context.disconnect()
        if (close) {
            await connectionApi.close(connectionId)
            return
        }
        setConnections((prev) => ({
            ...prev,
            [connectionId]: {
                ...prev[connectionId],
                context: undefined as any,
                connected: false
            }
        }))
    }

    const quitClosedConnection = () => {
        setConnections((prev) => {
            const newState = { ...prev };
            delete newState[connectionId];
            return newState;
        })
        setClosedConnection(prev => prev.filter(e => e._id !== connectionId))
    }

    return {
        nodes: connections[connectionId]?.nodes ?? [],
        robot: connections[connectionId]?.robot ?? defaultRobot,
        context: connections[connectionId]?.context,
        connectors: connections[connectionId]?.graphs,
        connected: connections[connectionId]?.connected,
        closedConnection: closedConnections.find(e => e._id === connectionId),
        setNodes,
        addNode,
        removeNode,
        getRelatedNodes,
        quitConnection,
        quitClosedConnection
    }
}