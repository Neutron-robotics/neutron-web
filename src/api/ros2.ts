import api from "./api";
import {
  CreateActionModel,
  CreateMessageTypeModel,
  CreatePublisherModel,
  CreateServiceModel,
  CreateSubscriberModel,
  CreateTopicModel,
} from "./models/ros2.model";

const createTopic = async (
  robotId: string,
  partId: string,
  createModel: CreateTopicModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createTopic`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const createPublisher = async (
  robotId: string,
  partId: string,
  createModel: CreatePublisherModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createPublisher`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const createSubscriber = async (
  robotId: string,
  partId: string,
  createModel: CreateSubscriberModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createSubscriber`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const createAction = async (
  robotId: string,
  partId: string,
  createModel: CreateActionModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createAction`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const createService = async (
  robotId: string,
  partId: string,
  createModel: CreateServiceModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createService`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const createMessageType = async (
  robotId: string,
  partId: string,
  createModel: CreateMessageTypeModel
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/createMessageType`,
    createModel
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const getRos2System = async (
  robotId: string,
  partId: string,
  createModel: CreateServiceModel
) => {
  const res = await api.get(`ros2/${robotId}`);

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const deleteTopic = async (
  robotId: string,
  partId: string,
  topicId: string
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/deleteTopic/${topicId}`
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const deletePublisher = async (
  robotId: string,
  partId: string,
  publisherId: string
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/deletePublisher/${publisherId}`
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const deleteSubscriber = async (
  robotId: string,
  partId: string,
  subscriberId: string
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/deleteSubscriber/${subscriberId}`
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const deleteAction = async (
  robotId: string,
  partId: string,
  deleteId: string
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/deleteAction/${deleteId}`
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

const deleteService = async (
  robotId: string,
  partId: string,
  serviceId: string
) => {
  const res = await api.post(
    `ros2/${robotId}/${partId}/deleteService/${serviceId}`
  );

  if (res.status !== 200) {
    throw new Error("Could not achieve ros2 operation");
  }
};

export {
  createTopic,
  createAction,
  createMessageType,
  createPublisher,
  createService,
  createSubscriber,
  getRos2System,
  deleteAction,
  deletePublisher,
  deleteService,
  deleteSubscriber,
  deleteTopic,
};
