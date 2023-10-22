import NodePreview from "../Nodes/NodePreview"
import BaseControllerNode from "../Nodes/components/BaseControllerNode"
import Ros2CameraNode from "../Nodes/components/Ros2CameraNode"
import { useMenuStyles } from "./styles"
import { ComponentMenuProps } from "./types"

const ComponentsMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useMenuStyles()

    return (
        <>
            <span>Controls</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='Base Controller' canBeInput onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{ preview: true }} node={BaseControllerNode} width={120} height={60} />
            </div>
            <span>Vision</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='Ros2 Camera' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{ preview: true }} node={Ros2CameraNode} width={120} height={60} />
            </div>
        </>
    )
}

export default ComponentsMenu