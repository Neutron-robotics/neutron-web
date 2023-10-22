import NodePreview from "../Nodes/NodePreview"
import ActionNode from "../Nodes/ros/ActionNode"
import PublisherNode from "../Nodes/ros/PublisherNode"
import ServiceNode from "../Nodes/ros/ServiceNode"
import SubscriberNode from "../Nodes/ros/SubscriberNode"
import { useMenuStyles } from "./styles"
import { Ros2MenuProps } from "./types"

const RosMenu = (props: Ros2MenuProps) => {
    const { ros2System, onDragStart, onDragEnd } = props
    const classes = useMenuStyles()

    return (
        <>
            <span>Publishers</span>
            <div className={classes.rosComponentList}>
                {ros2System?.publishers.map(pub => (
                    <NodePreview
                        key={pub._id}
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        title={pub.name}
                        node={PublisherNode}
                        nodeProps={{
                            publisher: pub,
                            title: pub.name
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Subscribers</span>
            <div className={classes.rosComponentList}>
                {ros2System?.subscribers.map(sub => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={SubscriberNode}
                        title={sub.name}
                        nodeProps={{
                            subscriber: sub,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Services</span>
            <div className={classes.rosComponentList}>
                {ros2System?.services.map(srv => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={ServiceNode}
                        title={srv.name}
                        nodeProps={{
                            service: srv,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Actions</span>
            <div className={classes.rosComponentList}>
                {ros2System?.actions.map(act => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={ActionNode}
                        title={act.name}
                        nodeProps={{
                            action: act,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
        </>
    )
}

export default RosMenu