import { makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, Position } from "reactflow"
import { v4 } from "uuid"

const useStyles = makeStyles(() => ({
    andGate: {
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

interface AndNodeProps {

}

const AndNode = (props: AndNodeProps) => {
    const { } = props
    const classes = useStyles()
    const nodeUid = useMemo(() => v4(), [])

    return (
        <div className={classes.andGate}>
            <div className={classes.textNode}>
                AND
            </div>
            <Handle id={`input-1-${nodeUid}`}
                type="target"
                style={{ position: 'relative', left: '-6px', top: '15px' }}
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />

            <Handle id={`input-2-${nodeUid}`}
                type="target"
                style={{ position: 'relative', left: '-6px', top: '35px' }}
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />

            <Handle id={`output-${nodeUid}`}
                type="source"
                position={Position.Right}
                isConnectableStart={true}
                isConnectableEnd={false} />
        </div>
    )
}

export default AndNode