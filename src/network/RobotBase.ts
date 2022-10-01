import { inRange } from "../utils/MathUtils";
import { IBatteryInfo } from "./IRobot";
import { IRobotConnectionContext } from "./RosContext";

export type Direction = "forward" | "backward" | "left" | "right";

export interface IRobotBaseConfiguration {
    directionnalSpeed: number;
    rotationSpeed: number;
}

export default abstract class RobotBase {

    public id: string;

    public name: string;

    public configuration: IRobotBaseConfiguration;

    public batteryInfo: IBatteryInfo;

    public speed: number;

    protected abstract context: IRobotConnectionContext;

    constructor(id: string, name: string, configuration: IRobotBaseConfiguration) {
        this.name = name;
        this.configuration = configuration;
        if (!inRange(configuration.directionnalSpeed, 0, 1) || !inRange(configuration.rotationSpeed, 0, 1)) 
            throw new Error("Invalid speed configuration: speed range is [0, 1]");
        this.id = id;
        this.batteryInfo = {
            level: -1,
            measurement: "percent",
            charging: false,
        };
        this.speed = 50;
    }

    public abstract move(direction: Direction): void;

    public abstract stop(): void;

    public abstract rotate(direction: Direction): void;

    public abstract setSpeed(speed: number): void
}