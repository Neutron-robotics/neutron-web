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