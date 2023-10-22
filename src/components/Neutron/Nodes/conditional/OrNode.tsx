import { makeStyles } from "@mui/styles"
import { Handle, Position } from "reactflow"

const useStyles = makeStyles(() => ({
    orGate: {
        width: "80px",
        height: "60px",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: '0 40px 40px 0'
    },
    textNode: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
}))

interface OrNodeProps {

}

const OrNode = (props: OrNodeProps) => {
    const classes = useStyles()
    return (
        <div className={classes.orGate}>
            <div className={classes.textNode}>
                OR
            </div>
            <Handle id={`input-1`}
                type="target"
                style={{ position: 'relative', left: '-6px', top: '15px' }}
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />

            <Handle id={`input-2`}
                type="target"
                style={{ position: 'relative', left: '-6px', top: '35px' }}
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />

            <Handle id={`nodeOutput`}
                type="source"
                position={Position.Right}
                isConnectableStart={true}
                isConnectableEnd={false} />
        </div>
    )
}

export default OrNode