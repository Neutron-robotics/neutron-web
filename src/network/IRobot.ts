interface IRobotConnectionConfiguration {
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
    ROSBRIDGE,
}

const getRobotConnectionTypeFromString = (type: string): RobotConnectionType => {
    switch (type.toUpperCase()) {
        case "TCP":
            return RobotConnectionType.TCP;
        case "UDP":
            return RobotConnectionType.UDP;
        case "ROSBRIDGE":
            return RobotConnectionType.ROSBRIDGE;
        default:
            throw new Error(`Unknown robot connection type: ${type}`);
    }
};

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
    IRobotConnectionConfiguration,
    IRobotModule,
    IBatteryInfo,
    IRobotConnectionInfo,
}

export {
    RobotStatus,
    RobotConnectionType,
    getRobotConnectionTypeFromString,
}