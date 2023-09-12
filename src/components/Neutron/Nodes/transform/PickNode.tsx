import { makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, Position } from "reactflow"
import { v4 } from "uuid"

const useStyles = makeStyles(() => ({
    andGate: {
        width: "100px",
        height: "60px",
        background: "#fff",
        border: "1px solid #eee",
    },
    textNode: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
}))

interface PickNodeProps {

}

const PickNode = (props: PickNodeProps) => {
    const { } = props
    const classes = useStyles()
    const nodeUid = useMemo(() => v4(), [])

    return (
        <div className={classes.andGate}>
            <Handle id={`input-${nodeUid}`}
                type="target"
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

export default PickNode