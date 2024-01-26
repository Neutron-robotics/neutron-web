import { makeStyles } from "@mui/styles"
import { useParams } from "react-router-dom"
import ReactFlow, { Background, BackgroundVariant, NodeChange, ReactFlowProvider, applyNodeChanges } from "reactflow"
import { useConnection } from "../contexts/ConnectionContext"
import ConnectionToolBar from "../components/Connection/ConnectionToolbar"
import { componentType } from "../components/Connection/components/componentType"

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
        setNodes
    } = useConnection(connectionId)


    function onNodesChange(changes: NodeChange[]): void {
        setNodes(applyNodeChanges(changes, nodes))
    }

    return (
        <div className={classes.root}>
            <ReactFlowProvider>
                <ConnectionToolBar
                    connectionId={connectionId}
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