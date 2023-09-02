import { v4 } from "uuid";
import { IRobot, IRobotPart } from "../api/models/robot.model";
import { IRos2ActionMessage, IRos2Field, IRos2Message, IRos2PartSystem, IRos2ServiceMessage, IRos2System, IRos2Topic } from "neutron-core";

export const cacheRos2System = (robot: IRobot , system: IRos2System) => {
  for (const part of robot.parts) {
    const partSystem = toPartSystem(part, system)

    localStorage.setItem(`messageTypes-${robot._id}-${part._id}`, JSON.stringify(partSystem.messageTypes));
    localStorage.setItem(`serviceType-${robot._id}-${part._id}`, JSON.stringify(partSystem.serviceTypes));
    localStorage.setItem(`actionType-${robot._id}-${part._id}`, JSON.stringify(partSystem.actionTypes));

    localStorage.setItem(`topics-${robot._id}-${part._id}`, JSON.stringify(partSystem.topics));
    localStorage.setItem(`publishers-${robot._id}-${part._id}`, JSON.stringify(partSystem.publishers));
    localStorage.setItem(`subscribers-${robot._id}-${part._id}`, JSON.stringify(partSystem.subscribers));
    localStorage.setItem(`services-${robot._id}-${part._id}`, JSON.stringify(partSystem.services));
    localStorage.setItem(`actions-${robot._id}-${part._id}`, JSON.stringify(partSystem.actions));
  }
}

export const toPartSystem = (part: IRobotPart, system: IRos2System) => {
  const partSystem: IRos2PartSystem = {
    name: "",
    robotId: system.robotId,
    _id: v4(),
    topics: system.topics.reduce((acc: IRos2Topic[], cur: IRos2Topic) => {
      if (!acc.find((e) => e._id === cur._id)) acc.push(cur);
      return acc;
    }, [] as IRos2Topic[]),
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
      if (!acc.find(a => a._id === cur.messageType._id)) {
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

export function parseRos2ServiceMessageContent(fileContent: string) {
  const lines = fileContent.split("\n");
  const requestFields: IRos2Field[] = [];
  const responseFields: IRos2Field[] = [];
  let isResponseSection = false;

  for (const line of lines) {
    if (!line.replaceAll(" ", "").length) continue;

    if (line.trim() === "---") {
      isResponseSection = true;
      continue;
    }

    const [fieldName, fieldType] = line.split(" ");
    if (!fieldName || !fieldType) throw new Error("Inconsistent type or param");

    const field = {
      fieldname: fieldName,
      fieldtype: fieldType,
    };

    if (isResponseSection) {
      responseFields.push(field);
    } else {
      requestFields.push(field);
    }
  }

  return {
    request: requestFields,
    response: responseFields,
  };
}

export function parseRos2ActionMessageContent(fileContent: string) {
  const lines = fileContent.split("\n");
  const goalFields: IRos2Field[] = [];
  const feedbackFields: IRos2Field[] = [];
  const resultFields: IRos2Field[] = [];
  let currentSection: 'goal' | 'feedback' | 'result' = 'goal';

  for (const line of lines) {
    if (!line.replaceAll(" ", "").length) continue;

    if (line.trim() === '---') {
      if (currentSection === 'goal') {
        currentSection = 'feedback';
      } else if (currentSection === 'feedback') {
        currentSection = 'result';
      } else {
        throw new Error("Invalid section separator");
      }
      continue;
    }

    const [fieldName, fieldType] = line.split(" ");
    if (!fieldName || !fieldType) throw new Error("Inconsistent type or param");

    const field = {
      fieldname: fieldName,
      fieldtype: fieldType,
    };

    if (currentSection === 'goal') {
      goalFields.push(field);
    } else if (currentSection === 'feedback') {
      feedbackFields.push(field);
    } else if (currentSection === 'result') {
      resultFields.push(field);
    }
  }

  return {
    goal: goalFields,
    feedback: feedbackFields,
    result: resultFields,
  };
}