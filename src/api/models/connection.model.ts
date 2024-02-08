export interface INeutronConnectionDescriptor {
  id: string;
  timeStarted: number;
  leaderId: string;
}

export interface INeutronConnection {
  _id: string
  robotId: string;
  isActive: boolean;
  createdBy: string
  createdAt: string
  closedAt: string
  port: number
}

export interface CreateConnectionBody {
  robotId: string
}

export interface ConnectionRegistrationInfos {
  hostname: string,
  port: number,
  registerId: string
  connectionId: string
}