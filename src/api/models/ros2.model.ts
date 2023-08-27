import { IDBObject } from "./common"

export interface CreateTopicModel {
    name: string,
    messageTypeId: string
  }

  export interface CreatePublisherModel {
    name: string,
    topicId: string,
    frequency: number
  }

  export interface CreateSubscriberModel {
    name: string,
    topicId: string,
  }

  export interface CreateActionModel {
    name: string
    actionTypeId: string
}

export interface CreateServiceModel {
    name: string,
    serviceTypeId: string,
  }

  export interface CreateMessageTypeModel {
    robotId: string
    partId: string
  }

  export interface Ros2SystemModel extends IDBObject {
    name: string;
    topics: string[];
    publishers: string[];
    subscribers: string[];
    actions: string[];
    services: string[];
    robotId: string
  }

  export interface Ros2Field {
    fieldtype: string;
    fieldname: string;
  }

export interface IMessageType extends IDBObject {
  name: string,
  fields: Ros2Field[]
}