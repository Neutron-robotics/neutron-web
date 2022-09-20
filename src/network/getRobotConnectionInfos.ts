import axios from "axios";
import { v4 } from "uuid";
import { IRobotConnection, IRobotConnectionInfo, RobotStatus } from "./IRobot";

const getRobotConnectionInfos = async (
  connection: IRobotConnectionInfo
): Promise<IRobotConnection> => {
  try {
    const response = await axios.get(
      `http://${connection.hostname}:${connection.port}/robot`
    );
    const data = response.data;

    return data;
  } catch (error) {
    return Promise.resolve(getErrorRobotConnection(connection));
  }
};

const getErrorRobotConnection = (connection: IRobotConnectionInfo): IRobotConnection => ({
  id: v4(),
  name: "Unknown",
  type: "Unknown",
  batteryInfo: {
    level: 0,
    measurement: 'percent',
    charging: false,
  },
  status: RobotStatus.Error,
  connection: connection,
  parts: [],
});

export { getRobotConnectionInfos };
