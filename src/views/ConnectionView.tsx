import { makeStyles } from "@mui/styles"
import { useParams } from "react-router-dom"
import ReactFlow, { Background, BackgroundVariant, NodeChange, ReactFlowProvider, applyNodeChanges } from "reactflow"
import { useConnection } from "../contexts/ConnectionContext"
import ConnectionToolBar from "../components/Connection/ConnectionToolbar"
import { componentType } from "../components/Connection/components/componentType"
import useGraphNotifications from "../components/controls/useGraphNotifications"
import useAsync from "../utils/useAsync"
import { INeutronConnection } from "../api/models/connection.model"
import * as connectionApi from "../api/connection"

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
        connectors
    } = useConnection(connectionId)
    useGraphNotifications(connectors)
    const [connection, _, isConnectionLoading, connectionError] = useAsync<INeutronConnection>(
        undefined,
        () => connectionApi.getById(connectionId)
    )

    function onNodesChange(changes: NodeChange[]): void {
        setNodes(applyNodeChanges(changes, nodes))
    }

    if (connectionError)
        return <div>An error happenned here</div>

    if (isConnectionLoading || !connection)
        return <div></div>

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