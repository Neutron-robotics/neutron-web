import { CSSProperties, makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, NodeProps, Position } from "reactflow"

const useStyles = makeStyles(() => ({
    nodeRoot: {
        border: '1px solid black',
        minWidth: '150px',
        minHeight: '30px',
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '5px',
        background: 'white',
        "& label": {
            display: 'block',
            color: ' #777',
            fontSize: '12px',
        },
        userSelect: 'none'
    },
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
        width: '100%',
        textAlign: 'center'
    },
}))

interface FlowNodeProps {
    color: string
    inputHandles: number
    outputHandles: number
    name: string
}

const FlowNode = (props: NodeProps<FlowNodeProps>) => {
    const { data } = props
    const { color, inputHandles, outputHandles, name } = data
    const classes = useStyles()


    const maxHandleCount = useMemo(() => 30 + (Math.max(inputHandles, outputHandles) * 10), [inputHandles, outputHandles])
    const nodeStyle: CSSProperties = {
        background: color
    }
    return (
        <div style={{ ...nodeStyle, minHeight: maxHandleCount }} className={classes.nodeRoot}>
            <div className={classes.nodeTitle}>{name}</div>
            <div className={classes.nodeBody}>
                <div>
                    {Array.from({ length: inputHandles }, (_, index) => (
                        <Handle key={index} id={`input-${index}`}
                            type="target"
                            style={{ position: 'relative', left: '-10px' }}
                            position={Position.Left}
                            isConnectableStart={false}
                            isConnectableEnd={true} />
                    )
                    )}
                </div>
                <div>
                    {Array.from({ length: outputHandles }, (_, index) => (
                        <Handle key={index} id={`output-${index}`}
                            type="source"
                            style={{ position: 'relative', right: '-10px', marginBottom: '10px' }}
                            position={Position.Right}
                            isConnectableStart={true}
                            isConnectableEnd={false} />
                    )
                    )}
                </div>
            </div>
        </div>
    )
}

export default FlowNode