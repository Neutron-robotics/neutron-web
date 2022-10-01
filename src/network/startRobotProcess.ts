import axios from "axios";
import {  IRobotModule } from "./IRobot";
import { IRobotConnectionContext } from "./RosContext";

const startRobotProcess = async (
  context: IRobotConnectionContext,
  robot: IRobotModule
): Promise<boolean> => {
  try {
    const {hostname, port} = context.connectionConfiguration.core;
    const response = await axios.post(
      `http://${hostname}:${port}/start`,
      {
        name: robot.name,
        processId: robot.id,
      }
    );
    if (response.status === 200) return true;
  } catch (e) {
    return false;
  }
  return false;
};

const stopRobotProcess = (
  context: IRobotConnectionContext,
  robot: IRobotModule
): Promise<boolean> => {
  return new Promise((resolve) => {
    const {hostname, port} = context.connectionConfiguration.core;
    axios
      .post(
        `http://${hostname}:${port}/stop`,
        {
          name: robot.name,
          processId: robot.type,
        }
      )
      .then((response) => {
        if (response.status === 200) resolve(true);
        else resolve(false);
      })
      .catch((e) => {
        resolve(false);
      });
  });
};

export { startRobotProcess, stopRobotProcess };
