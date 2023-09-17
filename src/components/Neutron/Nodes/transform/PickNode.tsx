import { MenuItem, Select } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Handle, Position } from "reactflow"
import { CustomNodeProps } from ".."

const useStyles = makeStyles(() => ({
    nodeRoot: {
        width: "120px",
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

interface PickNodeProps {

}

const PickNode = (props: CustomNodeProps<PickNodeProps>) => {
    const { preview } = props
    const classes = useStyles()

    return (
        <div className={classes.nodeRoot}>
            <Handle id={`source`}
                type="target"
                position={Position.Left}
                isConnectableStart={false}
                isConnectableEnd={true} />
            <Select
                value={10}
                label="Pick"
                className="nodrag"
                sx={{ m: 1, width: 90 }} size="small"
                disabled={preview}
            >
                <MenuItem value={10}>property 1</MenuItem>
                <MenuItem value={20}>property 2</MenuItem>
                <MenuItem value={30}>property 3</MenuItem>
            </Select>
            <span className={classes.nodeLabel}>Pick</span>
            <Handle id={`result`}
                type="source"
                position={Position.Right}
                isConnectableStart={true}
                isConnectableEnd={false} />
        </div>
    )
}

export default PickNode