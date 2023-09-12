import ActionNode from "./ActionNode";
import PublisherNode from "./PublisherNode";
import ServiceNode from "./ServiceNode";
import SubscriberNode from "./SubscriberNode";

export const rosNodeTypes = {
    publisherNode: PublisherNode,
    subscriberNode: SubscriberNode,
    serviceNode: ServiceNode,
    actionNode: ActionNode
}