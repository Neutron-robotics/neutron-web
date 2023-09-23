import { makeStyles } from "@mui/styles"
import { CustomNodeProps } from ".."
import RobotBaseComponent from "../../../OperationComponents/active/RobotBaseComponent"
import { Handle, Position } from "reactflow"

const useStyles = makeStyles(() => ({
    preview: {
        pointerEvents: 'none',
        transform: 'scale(0.5) translate(-50%, -50%)'
    },
    outputField: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    nodeTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    nodeRoot: {
        border: '1px solid #eee',
        padding: '5px',
        borderRadius: '5px',
        background: 'white',
        "& label": {
            display: 'block',
            color: ' #777',
            fontSize: '12px',
        },
        userSelect: 'none'
    },
}))

interface BaseControllerNodeProps {
    preview?: boolean
}

const BaseControllerNode = (props: CustomNodeProps<BaseControllerNodeProps>) => {
    const { preview } = props
    const classes = useStyles()

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <div
                className={preview ? classes.preview : ''}
                style={{
                    border: '1px solid #eee',
                    background: 'white',
                }}
            >
                <RobotBaseComponent connectionId="preview" specifics={{}} onCommitComponentSpecific={() => { }} />
            </div>
            {!preview && (
                <>
                    <div style={{
                        border: 'none',
                        borderTop: '2px dotted #000000',
                        color: '#fff',
                        width: '50%',
                        transform: 'translate(0%, 50%)'
                    }}></div>
                    <div className={classes.nodeRoot}>
                        <div className={classes.nodeTitle}>
                            Base Controller
                        </div>
                        {['top', 'left', 'right', 'bottom', 'speed'].map(control => (
                            <div key={control} className={classes.outputField} >
                                <Handle
                                    id={control}
                                    type="source"
                                    style={{ position: 'relative', right: '-10px' }}
                                    position={Position.Right}
                                    isConnectableStart={true}
                                    isConnectableEnd={false} />
                                {control}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default BaseControllerNode