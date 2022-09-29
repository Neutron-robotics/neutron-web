import axios from "axios";
import { v4 } from "uuid";
import { getRobotConnectionTypeFromString, IRobotConnectionConfiguration, IRobotConnectionInfo, RobotStatus } from "./IRobot";

const getRobotConnectionInfos = async (
  connection: IRobotConnectionInfo
): Promise<IRobotConnectionConfiguration | null> => {
  try {
    const response = await axios.get(
      `http://localhost:${connection.port}/robot/configuration`
    );
    const data = response.data;
    const payload = data.robot
    if (!payload) 
        throw new Error("No robot configuration found");
    const robotConnection: IRobotConnectionConfiguration = {
        id: v4(),
        name: payload.name,
        type: payload.type,
        batteryInfo: {
            level: payload.battery,
            measurement: 'percent',
            charging: false,
        },
        status: payload.status,
        connection: {
            hostname: connection.hostname,
            port: payload.connection.port,
            type: getRobotConnectionTypeFromString(payload.connection.type),
        },
        parts: payload.modules,
    }
    return robotConnection;
  } catch (error: any) {
    console.log(error)
    return Promise.resolve(null);
  }
};

export { getRobotConnectionInfos };
