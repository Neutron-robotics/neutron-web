import { makeStyles } from "@mui/styles"
import { FC } from "react"
import { CustomNodeProps, nodeTypes } from "."
import { v4 } from "uuid"

const useStyles = makeStyles(() => ({
    preview: {
        position: 'relative'
    }
}))

interface NodePreviewProps<T> {
    title: string
    node: FC<CustomNodeProps<T>>
    nodeProps: T,
    width: number,
    height: number,
    onDragStart: () => void,
    onDragEnd: () => void
}

const NodePreview = <T,>(props: NodePreviewProps<T>) => {
    const { node: Node, nodeProps, width, height, onDragEnd, onDragStart, title } = props
    const classes = useStyles()
    const nodeType = Object.keys(nodeTypes).find(e => nodeTypes[e] === Node) ?? ''

    const defaultProps: CustomNodeProps<T> = {
        zIndex: 1,
        title,
        data: {
            ...nodeProps
        },
        id: v4(),
        type: nodeType,
        isConnectable: false,
        xPos: 0,
        yPos: 0,
        selected: false,
        dragging: false,
        preview: true
    }

    const handleDragStart = (event: React.DragEvent, nodeType: string) => {
        console.log("drag started")
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/data', JSON.stringify(nodeProps));
        event.dataTransfer.effectAllowed = 'move';
        onDragStart()
    };

    return (
        <div className={classes.preview} draggable onDragStart={(event) => handleDragStart(event, nodeType)} onDragEnd={onDragEnd} style={{ width, height }}>
            <Node {...defaultProps} />
        </div>
    )
}

export default NodePreview