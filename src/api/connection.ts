import api from "./api";
import {
  ConnectionRegistrationInfos,
  CreateConnectionBody,
  INeutronConnectionDTO,
} from "./models/connection.model";
import { IRobot } from "./models/robot.model";
import * as robotApi from "./robot";

const create = async (
  model: CreateConnectionBody
): Promise<ConnectionRegistrationInfos> => {
  const res = await api.post(`connection/create`, model);

  if (res.status !== 200) {
    throw new Error("Could not create the connection");
  }

  return res.data.connection as ConnectionRegistrationInfos;
};

const join = async (
  connectionId: string
): Promise<ConnectionRegistrationInfos> => {
  const res = await api.post(`connection/join/${connectionId}`);

  if (res.status !== 200) {
    throw new Error("Could not join the connection");
  }
  return res.data.connection as ConnectionRegistrationInfos;
};

const close = async (connectionId: string): Promise<void> => {
  const res = await api.post(`connection/close/${connectionId}`);

  if (res.status !== 200) {
    throw new Error("Could not close the connection");
  }
};

const getById = async (connectionId: string): Promise<INeutronConnectionDTO> => {
  const res = await api.get(`connection/${connectionId}`)

    if (res.status !== 200) {
        throw new Error("Could not get the connection")
    }
    return res.data.connection as INeutronConnectionDTO
}

const getMyConnections = async (status?: 'active' | 'inactive'): Promise<INeutronConnectionDTO[]> => {
  const res = await api.get(`connection/${status ? `?status=${status}` : ''}`)

    if (res.status !== 200) {
        throw new Error("Could not get connections")
    }
    return res.data.connections as INeutronConnectionDTO[]
}

const connectRobotAndCreateConnection = async (robotId: string, partsId?: string[]): Promise<ConnectionRegistrationInfos> => {
  let robot: IRobot | undefined;

  try {
    robot = await robotApi.getRobot(robotId, true);
  } catch {
    throw new Error("An error happened while getting robot informations");
  }

  if (!robot?.status) throw new Error("The robot does not include a status");

  if (
    robot.status.status === "Operating" ||
    robot.status.status === "Unknown" ||
    robot.status.status === "Offline"
  )
    throw new Error(
      `The robot is ${robot.status.status}`
    );

  try {
    await robotApi.start(robot._id, partsId);
  } catch {
    throw new Error("Failed to start the robot");
  }

  try {
    robot = await robotApi.getRobot(robotId, true);
  } catch {
    await robotApi.stop(robotId)
    throw new Error(
      "An error happened while getting robot informations after starting it"
    );
  }

  if (!robot.status?.context?.port) {    
    await robotApi.stop(robotId)
    throw new Error("Robot is not ready for connection");
  }

  let registrationInfos: ConnectionRegistrationInfos;
  try {
    registrationInfos = await create({
      robotId: robot._id,
    });
  } catch {
    await robotApi.stop(robotId)
    throw new Error("Failed to create the neutron connection");
  }

  return registrationInfos;
};

export { create, join, getById, getMyConnections, close, connectRobotAndCreateConnection };
