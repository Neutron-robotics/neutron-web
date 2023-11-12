import { hexToRGBA } from "../../../utils/color"
import { HTMLAttributes } from "react"
import { CSSProperties, makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    nodeBody: {
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    nodeTitle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%'
    },
    handle: {
        pointerEvents: "none",
        minWidth: "5px",
        minHeight: '5px',
        width: '6px',
        height: '6px',
        background: '#1a192b',
        border: '1px solid white',
        borderRadius: '100%',
    }
}))
interface INodePreview {
    name: string
    backgroundColor: string
    inputHandles: number
    outputHandles: number
}

interface NodePreviewProps extends HTMLAttributes<HTMLDivElement> {
    node: INodePreview
    style?: CSSProperties
}

const NodePreview = (props: NodePreviewProps) => {
    const { node, style, onDragStart, onDragEnd, ...otherProps } = props
    const classes = useStyles()

    const nodeStyle: CSSProperties = {
        background: hexToRGBA(node.backgroundColor, 0.4) ?? '',
        borderRadius: '5px',
        textAlign: 'center',
        border: '1px solid black',
        position: 'relative',
        minHeight:'30px'
    }

    const handleDragStart = (event: React.DragEvent) => {
        console.log("drag started")
        event.dataTransfer.setData('application/reactflow', 'flowNode');
        const nodeProps = {
            color: node.backgroundColor,
            name: node.name,
            inputHandles: node.inputHandles,
            outputHandles: node.outputHandles
        }
        event.dataTransfer.setData('application/reactflow/data', JSON.stringify(nodeProps));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            style={{ ...style, ...nodeStyle }}
            {...otherProps}
            onDragStart={handleDragStart}
            draggable
        >
            <div className={classes.nodeTitle}>{node.name}</div>
            <div className={classes.nodeBody}>
                <div>
                    {Array.from({ length: node.inputHandles }, (_, index) => (
                        <div
                            key={index}
                            style={{ position: 'relative', left: '-5px' }}
                            className={classes.handle}
                        />
                    ))}
                </div>
                <div>
                    {Array.from({ length: node.outputHandles }, (_, index) => (
                        <div
                            key={index}
                            style={{ position: 'relative', right: '-5px', marginBottom: '10px' }}
                            className={classes.handle}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NodePreview