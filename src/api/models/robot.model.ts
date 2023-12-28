import { INeutronConnection } from "./connection.model";

export enum RobotPartCategory {
  Actuator = "actuator",
  Vison = "vision",
  Base = "base",
}

export enum ConnectionContextType {
  Ros2 = "ros2",
  Tcp = "tcp",
  WebSocket = "websocket",
}

export interface IRobotPart {
  _id: string;
  type: string;
  category: RobotPartCategory;
  name: string;
  imgUrl: string;
  ros2Package: string;
  ros2Node: string;
  publishers: string[];
  subscribers: string[];
  services: string[];
  actions: string[];
}

export interface IRobot {
  _id: string;
  name: string;
  key: string;
  parts: IRobotPart[];
  linked: boolean;
  secretKey: string;
  imgUrl: string;
  description: string;
  context: ConnectionContextType;
}

export interface IRobotStatus {
  _id: string;
  time: number;
  status: "Online" | "Operating" | "Offline" | "Unknown";
  battery?: IBatteryStatus;
  connection?: INeutronConnection;
  system?: IRobotSystemStatus;
  location?: IRobotLocationStatus;
}

export interface IRobotLocationStatus {
  name: string;
}

export interface IBatteryStatus {
  charging: boolean;
  level: number;
}

export interface IRobotSystemStatus {
  battery?: number;
  cpu: number;
  memory: number;
  operationTime: number;
}

export interface ICreateRobotModel {
  name: string;
  parts?: IRobotPart[];
  imgUrl?: string;
  description: string;
}

export interface IUpdateRobotModel {
  name?: string;
  imgUrl?: string;
  description?: string;
  connexionContextType?: ConnectionContextType;
}
