import { IRos2Action, IRos2ActionMessage, IRos2Publisher, IRos2Service, IRos2ServiceMessage, IRos2Subscriber, IRos2Topic } from "@hugoperier/neutron-core"
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
    message?: Omit<IMessageType, "_id">
    service?: Omit<IRos2ServiceMessage, "_id">,
    action?: Omit<IRos2ActionMessage, "_id">
  }

  export interface UpdateSchemaTypeModel {
    publisher?: IRos2Publisher;
    subscriber?: IRos2Subscriber;
    topic?: IRos2Topic;
    action?: IRos2Action;
    service: IRos2Service
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