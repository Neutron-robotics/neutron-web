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
  type: ConnectionContextType;
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
  hostname: string
  linked: boolean;
  secretKey: string;
  imgUrl: string;
  description: string;
  context: ConnectionContextType;
  status?: IRobotStatus
}

export interface IRobotWithStatus extends IRobot {
  status: IRobotStatus
}

export interface IRobotProcess {
  cpu: number;
  mem: number;
  mem_usage: number;
  active: boolean;
  pid: number;
  name: string;
  id: string;
}

export interface IRobotContextProcess extends IRobotProcess {
  port: number
}

export interface IRobotStatus {
  _id: string;
  time: number;
  status: "Online" | "Operating" | "Offline" | "Unknown";
  battery?: IBatteryStatus;
  system?: IRobotSystemStatus;
  location?: IRobotLocationStatus;
  processes?: IRobotProcess[]
  context?: IRobotContextProcess
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

export const defaultRobot: IRobot = {
  name: "New Robot",
  description: "Enter here the description of the robot",
  _id: "",
  key: "",
  parts: [],
  hostname: "",
  linked: false,
  secretKey: "",
  imgUrl: "",
  context: ConnectionContextType.Ros2
}

export const defaultRobotPartModel: IRobotPart = {
  _id: "newpart",
  type: ConnectionContextType.Ros2,
  category: RobotPartCategory.Actuator,
  name: "New part",
  imgUrl: "",
  ros2Package: "",
  ros2Node: "",
  publishers: [],
  subscribers: [],
  services: [],
  actions: []
}

export const defaultRobotStatus: IRobotStatus = {
  _id: "",
  time: -1,
  status: "Unknown"
}