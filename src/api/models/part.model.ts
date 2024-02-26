import { ConnectionContextType, RobotPartCategory } from "./robot.model";

export interface CreateRobotPartModel {
  type: ConnectionContextType;
  category: RobotPartCategory;
  name: string;
  imgUrl?: string;
  ros2Package?: string,
  ros2Node?: string
}

export interface UpdatePartModel {
    robotId: string
    partId: string
}