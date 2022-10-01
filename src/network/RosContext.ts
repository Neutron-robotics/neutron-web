import ROSLIB, { Message, Service, ServiceRequest, ServiceResponse, Topic } from "roslib";
import { Ros } from "roslib";
import { IRobotConnectionConfiguration, IRobotConnectionInfo, RobotConnectionType } from "./IRobot";
import { TopicSettings } from "./rosInterfaces";

export interface IRobotConnectionContext {
  type: RobotConnectionType;
  connectionConfiguration: IRobotConnectionConfiguration;
  isConnected: boolean;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export const makeConnectionContext = (
  type: RobotConnectionType,
  connectionConfiguration: IRobotConnectionConfiguration
): IRobotConnectionContext => {
  switch (type) {
    case RobotConnectionType.ROSBRIDGE:
      return new RosContext(connectionConfiguration);
    default:
      throw new Error("Invalid connection type");
  }
};

export default class RosContext implements IRobotConnectionContext {
  public ros: ROSLIB.Ros;

  public type: RobotConnectionType;

  public connectionConfiguration: IRobotConnectionConfiguration;

  public get isConnected(): boolean {
    return this.ros.isConnected;
  }

  constructor(connectionConfiguration: IRobotConnectionConfiguration) {
    this.ros = new Ros({});
    this.type = RobotConnectionType.ROSBRIDGE;
    this.connectionConfiguration = connectionConfiguration;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { hostname, port } = this.connectionConfiguration.connection;

      this.ros.on("connection", () => {
        console.log("Connected to websocket server.");
        resolve();
      });
      this.ros.on("error", (error) => {
        console.log("Error connecting to websocket server: ", error);
        reject(error);
      });
      this.ros.on("close", () => {
        console.log("Connection to websocket server closed.");
      });
      console.log(`Connecting to ws://${hostname}:${port}`);
      this.ros.connect(
        `ws://${hostname}:${port}`
      );
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.ros.close();
      resolve();
    });
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

  public subscribe(
    settings: TopicSettings,
    callback: (message: Message) => void
  ): Topic {
    const topic = this.getTopic(settings);
    topic.subscribe(callback);
    return topic;
  }

  public callService(
    name: string,
    serviceType: string,
    request?: object,
    callback: (resp: ServiceResponse) => void = (resp) => {},
    failedCallback?: (error: any) => void
  ) {
    const service = new Service({ ros: this.ros, name, serviceType });
    const serviceRequest = new ServiceRequest(request);
    service.callService(serviceRequest, callback, failedCallback);
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
