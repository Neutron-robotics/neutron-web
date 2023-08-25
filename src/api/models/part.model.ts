import { RobotPartCategory } from "./robot.model";

export interface CreateRobotPartModel {
  type: string;
  category: RobotPartCategory;
  name: string;
  imgUrl: string;
  ros2Package: string,
  ros2Node: string
}

export interface UpdatePartModel {
    robotId: string
    partId: string
}