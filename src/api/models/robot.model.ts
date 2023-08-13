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
    type: string
    category: RobotPartCategory
    name: string
    imgUrl: string
}

export interface IRobot {
    name: string
    parts: IRobotPart[]
    linked: boolean
    imgUrl: string
    description: string
    context: ConnectionContextType
}