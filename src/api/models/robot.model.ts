export enum RobotPartCategory {
    Actuator = 'actuator',
    Vison = 'vision',
    Base = 'base'
}

export enum ConnectionContextType {
    Ros2 = 'ros2',
    Tcp = 'tcp',
    WebSocket = 'websocket'
}

export interface IRobotPart {
    _id: string
    type: string
    category: RobotPartCategory
    name: string
    imgUrl: string
    ros2Package: string
    ros2Node: string
    publishers: string[]
    subscribers: string[]
    services: string[]
    actions: string[]
}

export interface IRobot {
    _id: string
    name: string
    parts: IRobotPart[]
    linked: boolean
    imgUrl: string
    description: string
    context: ConnectionContextType
}

export interface ICreateRobotModel {
    name: string
    parts?: IRobotPart[]
    imgUrl?: string
    description: string
}

export interface IUpdateRobotModel {
    name?: string
    imgUrl?: string
    description?: string
    connexionContextType?: ConnectionContextType
}