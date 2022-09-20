interface IRobotConnection {
    id: string;
    name: string;
    type: string;
    batteryInfo: IBatteryInfo;
    status: RobotStatus;
    connection: IRobotConnectionInfo;

    parts: IRobotModule[];
}

interface IRobotConnectionInfo {
    hostname: string;
    port: number;
    type: RobotConnectionType;
}
enum RobotConnectionType {
    TCP,
    UDP,
    ROS,
}

enum RobotStatus {
    Disconnected = "Disconnected",
    Available = "Available",
    Connected = "Connected",
    Busy = "Busy",
    Error = "Error",
}

interface IBatteryInfo {
    level: number;
    measurement: 'percent' | 'volt';
    charging: boolean;
}

interface IRobotModule {
    id: string;
    name: string;
    type: string;
}

export type {
    IRobotConnection,
    IRobotModule,
    IBatteryInfo,
    IRobotConnectionInfo,
}

export {
    RobotStatus,
    RobotConnectionType,
}