import { makeStyles } from "@mui/styles"
import { useNavigate, useParams } from "react-router-dom"
import ReactFlow, { Background, BackgroundVariant, NodeChange, ReactFlowProvider, applyNodeChanges } from "reactflow"
import { useConnection } from "../contexts/ConnectionContext"
import ConnectionToolBar from "../components/Connection/ConnectionToolbar"
import { componentType } from "../components/Connection/components/componentType"
import useAsync from "../utils/useAsync"
import { INeutronConnectionDTO } from "../api/models/connection.model"
import * as connectionApi from "../api/connection"
import JoinRobotConnection from "../components/Connection/JoinRobotConnection"
import ConnectionClosed from "../components/Connection/ConnectionClosed"
import { ViewType } from "../utils/viewtype"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    },
}))

interface IConnectionViewProps {
}

type ConnectionViewParams = {
    connectionId: string
}

const ConnectionView = (props: IConnectionViewProps) => {
    const classes = useStyles()
    const { connectionId } = useParams<ConnectionViewParams>() as ConnectionViewParams
    const {
        nodes,
        setNodes,
        context,
        robot,
        quitClosedConnection,
        connected,
        closedConnection
    } = useConnection(connectionId)
    const [connection, _, isConnectionLoading, connectionError] = useAsync<INeutronConnectionDTO>(
        undefined,
        () => connectionApi.getById(connectionId)
    )
    const navigate = useNavigate();

    function onNodesChange(changes: NodeChange[]): void {
        setNodes(applyNodeChanges(changes, nodes))
    }

    function onCloseConnection(): void {
        quitClosedConnection()
        navigate(`${ViewType.Home}`, { replace: true });
    }

    if (closedConnection)
        return <ConnectionClosed onClose={onCloseConnection} robot={robot} connection={closedConnection} />

    if (connectionError)
        return <div>An error happenned here</div>

    if (isConnectionLoading || !connection)
        return <div></div>

    if (!connected || !context)
        return <JoinRobotConnection connection={connection} />

    return (
        <div className={classes.root}>
            <ReactFlowProvider>
                <ConnectionToolBar
                    connection={connection}
                />
                <ReactFlow
                    nodes={nodes}
                    edges={[]}
                    onNodesChange={onNodesChange}
                    nodeTypes={componentType}
                    zoomOnPinch={false}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    panOnDrag={false}
                    autoPanOnNodeDrag={false}
                >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>
        </div >
    )
}

export default ConnectionView