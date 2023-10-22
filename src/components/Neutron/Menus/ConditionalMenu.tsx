import NodePreview from "../Nodes/NodePreview"
import AndNode from "../Nodes/conditional/AndNode"
import IfNode from "../Nodes/conditional/IfNode"
import OrNode from "../Nodes/conditional/OrNode"
import { useMenuStyles } from "./styles"
import { ComponentMenuProps } from "./types"

const ConditionalMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useMenuStyles()

    return (
        <>
            <span>Logic gates</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='And' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={AndNode} width={80} height={60} />
                <NodePreview title='Or' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={OrNode} width={80} height={60} />
            </div>
            <span>Conditions</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='If' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={IfNode} width={50} height={50} />
            </div>
        </>
    )
}

export default ConditionalMenu