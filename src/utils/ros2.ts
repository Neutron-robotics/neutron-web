import { v4 } from "uuid";
import { IDBObject } from "../api/models/common";
import { IRobotPart } from "../api/models/robot.model";

export interface IRos2System extends IDBObject {
  name: string;
  topics: IRos2Topic[];
  publishers: IRos2Publisher[];
  subscribers: IRos2Subscriber[];
  actions: IRos2Action[];
  services: IRos2Service[];
  robotId: string;
}

export interface IRos2PartSystem extends IRos2System {
  partId: string;
  messageTypes: IRos2Message[];
  serviceTypes: IRos2ServiceMessage[];
  actionTypes: IRos2ActionMessage[];
}

export interface IRos2Field {
  fieldtype: string;
  fieldname: string;
}

interface IRos2ServiceMessage extends IDBObject {
  name: string;
  request: IRos2Field[];
  response: IRos2Field[];
}

export interface IRos2Message extends IDBObject {
  name: string;
  fields: IRos2Field[];
}

interface IRos2ActionMessage extends IDBObject {
  name: string;
  goal: IRos2Field[];
  feedback: IRos2Field[];
  result: IRos2Field[];
}

export interface IRos2Topic extends IDBObject {
  name: string;
  messageType: IRos2Message;
}

interface IRos2Subscriber extends IDBObject {
  name: string;
  topic: IRos2Topic;
}

interface IRos2Service extends IDBObject {
  name: string;
  serviceType: IRos2ServiceMessage;
}

interface IRos2Publisher extends IDBObject {
  name: string;
  topic: IRos2Topic;
  frequency: number;
}

interface IRos2Action extends IDBObject {
  name: string;
  actionType: IRos2ActionMessage;
}

export const toPartSystem = (part: IRobotPart, system: IRos2System) => {
  const partSystem: IRos2PartSystem = {
    name: "",
    robotId: system.robotId,
    _id: v4(),
    topics: system.topics.filter(
      (e) => part.publishers.includes(e._id) || part.subscribers.includes(e._id)
    ),
    publishers: system.publishers.filter((e) =>
      part.publishers.includes(e._id)
    ),
    subscribers: system.subscribers.filter((e) =>
      part.subscribers.includes(e._id)
    ),
    services: system.services.filter((e) => part.services.includes(e._id)),
    actions: system.actions.filter((e) => part.actions.includes(e._id)),
    partId: part._id,
    actionTypes: [],
    messageTypes: [],
    serviceTypes: [],
  };
  partSystem.actionTypes = partSystem.actions.reduce<IRos2ActionMessage[]>(
    (acc, cur) => {
      if (!acc.includes(cur.actionType)) {
        acc.push(cur.actionType);
      }
      return acc;
    },
    []
  );

  partSystem.messageTypes = partSystem.topics.reduce<IRos2Message[]>(
    (acc, cur) => {
      if (!acc.includes(cur.messageType)) {
        acc.push(cur.messageType);
      }
      return acc;
    },
    []
  );

  partSystem.serviceTypes = partSystem.services.reduce<IRos2ServiceMessage[]>(
    (acc, cur) => {
      if (!acc.includes(cur.serviceType)) {
        acc.push(cur.serviceType);
      }
      return acc;
    },
    []
  );

  return partSystem;
};

export function parseRos2MessageContent(fileContent: string): IRos2Field[] {
  const lines = fileContent.split("\n");
  const fields: IRos2Field[] = [];

  // Ignore the first line, which is the message name.

  for (const line of lines) {
    if (!line.replaceAll(" ", "").length) continue;
    const [fieldName, fieldType] = line.split(" ");
    // The field type can be either a basic type or a message type.
    if (!fieldName || !fieldType) throw new Error("Inconsistent type or param");
    fields.push({
      fieldname: fieldName,
      fieldtype: fieldType,
    });
  }

  return fields;
}
