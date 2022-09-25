import ROSLIB, { Message, Topic } from "roslib";
import { Ros } from "roslib";
import { IRobotConnectionInfo, RobotConnectionType } from "./IRobot";
import { TopicSettings } from "./rosInterfaces";

export interface IRobotConnectionContext {
    type: RobotConnectionType
    connectionInfos: IRobotConnectionInfo
}

export const makeConnectionContext = (type: RobotConnectionType, connectionInfos: IRobotConnectionInfo): IRobotConnectionContext => {
    switch (type) {
        case RobotConnectionType.ROSBRIDGE:
            return new RosContext(connectionInfos);
        default:
            throw new Error("Invalid connection type");
    }
}

export default class RosContext implements IRobotConnectionContext {
  public ros: ROSLIB.Ros;

  public type: RobotConnectionType

  public connectionInfos: IRobotConnectionInfo

  constructor(connectionInfos: IRobotConnectionInfo) {
    this.ros = new Ros({});
    this.type = RobotConnectionType.ROSBRIDGE;
    this.connectionInfos = connectionInfos;
  }

  public publishOnce(topic: string, messageType: string, message: Message) {
    const publisher = new ROSLIB.Topic({
      ros: this.ros,
      name: topic,
      messageType,
    });
    publisher.publish(message);
    publisher.unadvertise();
  }

  public publishLoop(
    topic: string,
    messageType: string,
    message: Message,
    frequency: number
  ) {
    const topicSettings: TopicSettings = {
      topic,
      messageType,
    };
    const publisher = this.getTopic(topicSettings);
    const period = Math.round(1000 / frequency);
    const interval = setInterval(() => {
      console.log("publish");
      publisher.publish(message);
    }, period);
    return () => {
      clearInterval(interval);
      publisher.unadvertise();
    };
  }

  public subscribe(settings: TopicSettings, callback: (message: Message) => void): Topic {
    const topic = this.getTopic(settings);
    topic.subscribe(callback);
    return topic;
}

  private getTopic(settings: TopicSettings): Topic {
    const options = {
      ros: this.ros,
      name: settings.topic,
      messageType: settings.messageType,
      throttle_rate: settings.throttleRate || 10,
      latch: settings.latch || false,
      queue_length: settings.queueLength || 1,
      queue_size: settings.queueSize || 10,
    };
    return new Topic(options);
  }
}
