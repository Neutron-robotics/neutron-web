import NodePreview from "../Nodes/NodePreview"
import PickNode from "../Nodes/transform/PickNode"
import PurcentageNode from "../Nodes/transform/PurcentageNode"
import { useMenuStyles } from "./styles"
import { ComponentMenuProps } from "./types"

const TransformMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useMenuStyles()

    return (
        <>
            <span>Transformers</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='Pick' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={PickNode} width={120} height={60} />
                <NodePreview title='Purcentage' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={PurcentageNode} width={160} height={60} />
            </div>
        </>
    )
}

export default TransformMenu