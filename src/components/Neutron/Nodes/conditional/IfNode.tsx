import { makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, Position } from "reactflow"
import { v4 } from "uuid"

const useStyles = makeStyles(() => ({
    ifGate: {
        width: "60px",
        height: "60px",
        background: "#fff",
    },
    ifGateBorder: {
        border: "1px solid #eee",
        transform: 'rotate(45deg)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'white'
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
        <div className={classes.ifGate}>
            <div className={classes.ifGateBorder}>

            </div>
            <div className={classes.textNode}>
                IF
            </div>
            <Handle id={`nodeInput`}
                type="target"
                style={{ left: '-18px' }}
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />

            <Handle id={`nodeOutput`}
                type="source"
                style={{ right: '-18px' }}
                position={Position.Right}
                isConnectableStart={true}
                isConnectableEnd={false} />
        </div>
    )
}

export default OrNode