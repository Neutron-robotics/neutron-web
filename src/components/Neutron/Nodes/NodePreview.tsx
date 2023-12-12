import { hexToRGBA } from "../../../utils/color"
import { HTMLAttributes, useMemo } from "react"
import { CSSProperties, makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme: any) => ({
    nodePreview: {
        cursor: 'move',
        '&:hover': {
            boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
            borderColor: 'rgba(0,0,0,0)'
        }
    },
    nodeBody: {
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    nodeTitle: {
        position: 'relative',
        textAlign: 'center',
        width: '100%'
    },
    nodeIcon: {
        width: '50px',
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "& img": {
            width: '20px',
            filter: 'invert(1)'
        }
    },
    handleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        position: 'absolute',
        height: '100%',
        alignItems: 'center',
        top: 0
    },
    handle: {
        pointerEvents: "none",
        width: '10px',
        height: '10px',
        background: '#F4F4F4',
        border: '1px solid #CDCDCD',
        borderRadius: '3px',
    },
    containerNode: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    }
}))
interface INodePreview {
    name: string
    backgroundColor: string
    inputHandles: number
    outputHandles: number
    icon: string
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
        border: '1px solid #CDCDCD',
        position: 'relative',
        minHeight: '30px',
    }

    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData('application/reactflow', 'flowNode');
        const nodeProps = {
            color: node.backgroundColor,
            name: node.name,
            inputHandles: node.inputHandles,
            outputHandles: node.outputHandles,
            icon: node.icon
        }
        event.dataTransfer.setData('application/reactflow/data', JSON.stringify(nodeProps));
        event.dataTransfer.effectAllowed = 'move';
    };

    const iconSide = useMemo(() => {
        if (node.inputHandles > 0 && node.outputHandles > 0) {
            return 'left';
        } else if (node.outputHandles > 0) {
            return 'left';
        } else {
            return 'right';
        }
    }, [node])

    return (
        <div
            style={{ ...style, ...nodeStyle }}
            {...otherProps}
            onDragStart={handleDragStart}
            draggable
            className={classes.nodePreview}
        >
            <div className={classes.containerNode} style={{ flexDirection: iconSide === 'left' ? 'row' : 'row-reverse' }}>
                <div className={classes.nodeIcon}
                    style={{ left: 0, background: node.backgroundColor, borderRadius: iconSide === 'left' ? '5px 0px 0px 5px' : '0px 5px 5px 0px' }}>
                    <img alt="node-icon" src={`${process.env.PUBLIC_URL}/assets/nodes/${node.icon}`} />
                </div>
                <div className={classes.nodeTitle}>{node.name}</div>
            </div>
            <div className={classes.nodeBody}>
                <div className={classes.handleContainer} style={{ left: 0 }}>
                    {Array.from({ length: node.inputHandles }, (_, index) => (
                        <div
                            key={index}
                            style={{ position: 'relative', left: '-5px' }}
                            className={classes.handle}
                        />
                    ))}
                </div>
                <div className={classes.handleContainer} style={{ right: 0 }}>
                    {Array.from({ length: node.outputHandles }, (_, index) => (
                        <div
                            key={index}
                            style={{ position: 'relative', right: '-5px' }}
                            className={classes.handle}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NodePreview