import { makeStyles } from "@mui/styles"
import CameraComponent from "../../../OperationComponents/passive/CameraComponent"
import { Handle, Position } from "reactflow"

const useStyles = makeStyles(() => ({
    preview: {
        pointerEvents: 'none',
        transform: 'scale(0.5) translate(-50%, -50%)'
    },
    inputField: {
        display: 'flex',
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

interface Ros2CameraNodeProps {
    preview?: boolean
}

const Ros2CameraNode = (props: Ros2CameraNodeProps) => {
    const { preview } = props
    const classes = useStyles()

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            {!preview && (
                <>
                    <div className={classes.nodeRoot}>
                        <div className={classes.nodeTitle}>
                            Camera
                        </div>
                        <div className={classes.inputField} >
                            <Handle
                                id="image"
                                type="target"
                                style={{ position: 'relative', left: '-10px' }}
                                position={Position.Left}
                                isConnectableStart={false}
                                isConnectableEnd={true} />
                            image
                        </div>
                    </div>
                    <div style={{
                        border: 'none',
                        borderTop: '2px dotted #000000',
                        color: '#fff',
                        width: '50%',
                        transform: 'translate(0%, 50%)'
                    }}></div>
                </>
            )}
            <div
                className={preview ? classes.preview : ''}
                style={{
                    border: '1px solid #eee',
                    background: 'white',
                }}
            >
                <CameraComponent
                    connectionId="preview"
                    specifics={{
                        isConnected: true
                    }}
                    onCommitComponentSpecific={() => { }}
                />
            </div>
        </div>
    )
}

export default Ros2CameraNode