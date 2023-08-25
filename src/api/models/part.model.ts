import { RobotPartCategory } from "./robot.model";

export interface CreateRobotPartModel {
  type: string;
  category: RobotPartCategory;
  name: string;
  imgUrl: string;
}

export interface UpdatePartModel {
    robotId: string
    partId: string
}