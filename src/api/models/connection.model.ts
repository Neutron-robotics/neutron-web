export interface INeutronConnectionDescriptor {
  id: string;
  timeStarted: number;
  leaderId: string;
}

export interface INeutronConnection {
  robotId: string;
  isActive: boolean;
  createdBy: string
  createdAt: Date
  closedAt: Date
  pid: string
  port: number
}

export interface CreateConnectionBody {
  robotId: string
}

export interface ConnectionRegistrationInfos {
  hostname: string,
  port: number,
  registerId: string
}