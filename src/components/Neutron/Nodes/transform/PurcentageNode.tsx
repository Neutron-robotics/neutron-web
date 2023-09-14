import { TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, Position } from "reactflow"
import { v4 } from "uuid"
import { CustomNodeProps } from ".."

const useStyles = makeStyles(() => ({
    nodeRoot: {
        width: "160px",
        height: "70px",
        background: "#fff",
        border: "1px solid #eee",
        position: 'relative'
    },
    nodeLabel: {
        position: 'absolute',
        fontSize: '12px',
        fontWeight: 'bold',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
    }
}))

interface PurcentageNodeProps {

}

const PurcentageNode = (props: CustomNodeProps<PurcentageNodeProps>) => {
    const { preview } = props
    const classes = useStyles()
    const nodeUid = useMemo(() => v4(), [])

    return (
        <div className={classes.nodeRoot}>
            <Handle id={`input-${nodeUid}`}
                type="target"
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />
            <div>
                <TextField className="nodrag" sx={{ m: 1, width: 60 }} size="small" disabled={preview} label="min" variant="outlined" type="number" />
                <TextField className="nodrag" sx={{ m: 1, width: 60 }} size="small" disabled={preview} label="max" variant="outlined" type="number" />
            </div>
            <span className={classes.nodeLabel}>Purcentage</span>
            <Handle id={`output-${nodeUid}`}
                type="source"
                position={Position.Right}
                isConnectableStart={true}
                isConnectableEnd={false} />
        </div>
    )
}

export default PurcentageNode