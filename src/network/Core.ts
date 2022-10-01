import axios, { AxiosInstance } from "axios";
import { v4 } from "uuid";
import {
  getRobotConnectionTypeFromString,
  IRobotConnectionConfiguration,
  IRobotConnectionInfo,
  IRobotModule,
  RobotConnectionType,
  RobotStatus,
} from "./IRobot";

export interface ICoreProcess {
  cpu: number;
  mem: number;
  mem_usage: number;
  active: boolean;
  pid: number;
  name: string;
  id: string;
}

export interface ICoreModule extends IRobotModule {
  process?: ICoreProcess;
}

export default class Core {
  private connection: IRobotConnectionInfo;
  private axios: AxiosInstance;

  public readonly id: string = v4();

  public name: string;

  public type: string;

  public status: RobotStatus;

  public contextConfiguration: IRobotConnectionInfo;

  public battery: number;

  public modules: ICoreModule[];

  constructor(connection: IRobotConnectionInfo) {
    this.connection = connection;
    this.axios = axios.create({
      baseURL: `http://${connection.hostname}:${connection.port}`,
      timeout: 1000,
    });
    this.name = "";
    this.type = "";
    this.status = RobotStatus.Disconnected;
    this.battery = -1;
    this.modules = [];
    this.contextConfiguration = {
      hostname: "",
      port: -1,
      type: RobotConnectionType.HTTP,
    };
  }

  public setConnectionInfo = async (): Promise<void> => {
    const response = await this.axios.get("/robot/configuration");
    const data = response.data;
    const payload = data.robot;
    if (!payload) throw new Error("No robot configuration found");

    this.name = payload.name;
    this.type = payload.type;
    this.status = payload.status;
    this.battery = payload.battery;
    this.contextConfiguration = {
      hostname: this.connection.hostname,
      port: payload.connection.port,
      type: getRobotConnectionTypeFromString(payload.connection.type),
    };
    this.modules = payload.modules.map((module: IRobotModule) => {
      const process = this.modules.find((m) => m.id === module.id)?.process;
      return {
        ...module,
        process: process,
      };
    });
  };

  public getConnectionInfos = (): IRobotConnectionConfiguration => {
    return {
      id: this.id,
      name: this.name,
      type: this.name,
      batteryInfo: {
        level: this.battery,
        measurement: "percent",
        charging: false,
      },
      status: this.status,
      connection: {
        hostname: this.contextConfiguration.hostname,
        port: this.contextConfiguration.port,
        type: this.contextConfiguration.type,
      },
      core: {
        hostname: this.connection.hostname,
        port: this.connection.port,
        type: this.connection.type,
      },
      parts: this.modules,
    };
  };

  public refreshStatus = async (): Promise<void> => {
    const response = await this.axios.get("/robot/status");
    console.log(response)
    const data = response.data as ICoreProcess[];

    this.modules = this.modules.map((module: ICoreModule) => {
      const process = data.find((p) => p.id === module.id);
      return {
        ...module,
        process: process,
      };
    });
  };

  public startProcesses = async (): Promise<boolean> => {
    await this.refreshStatus();
    const res = (await Promise.all(
        this.modules.map((module) => this.startRobotProcess(module.id))
      )
    ).reduce((acc, val) => acc && val, true);
    await this.refreshStatus();
    return res;
  };

  public startRobotProcess = async (id: string): Promise<boolean> => {
    try {
      const module = this.modules.find((m) => m.id === id);
      if (!module) throw new Error("Module not found");
      if (module?.process?.active) return true;
      if (module?.process?.active === false) return true;

      const response = await this.axios.post("/start", {
        name: module.name,
        processId: module.id,
      });
      if (response.status === 200) return true;
    } catch (e) {
      console.error(e);
      return false;
    }
    return false;
  };

  public stopProcesses = async (): Promise<boolean> => {
    await this.refreshStatus();
    return (
      await Promise.all(
        this.modules.map((module) => this.stopRobotProcess(module.id))
      )
    ).reduce((acc, val) => acc && val, true);
  };

  public stopRobotProcess = async (id: string): Promise<boolean> => {
    try {
      const module = this.modules.find((m) => m.id === id);
      if (!module) throw new Error("Module not found");
      if (!module?.process?.active) return true;

      const response = await this.axios.post("/stop", {
        processId: module.id,
        flush: true,
      });
      if (response.status === 200) return true;
    } catch (e) {
      return false;
    }
    return false;
  };

  // public getConnectionInfos =
  //   async (): Promise<IRobotConnectionConfiguration | null> => {
  //     try {
  //       const response = await this.axios.get(`/robot/configuration`);
  //       const data = response.data;
  //       const payload = data.robot;
  //       if (!payload) throw new Error("No robot configuration found");
  //       const robotConnection: IRobotConnectionConfiguration = {
  //         id: v4(),
  //         name: payload.name,
  //         type: payload.type,
  //         batteryInfo: {
  //           level: payload.battery,
  //           measurement: "percent",
  //           charging: false,
  //         },
  //         status: payload.status,
  //         connection: {
  //           hostname: this.connection.hostname,
  //           port: payload.connection.port,
  //           type: getRobotConnectionTypeFromString(payload.connection.type),
  //         },
  //         core: {
  //           hostname: this.connection.hostname,
  //           port: this.connection.port,
  //           type: RobotConnectionType.HTTP,
  //         },
  //         parts: payload.modules,
  //       };
  //       return robotConnection;
  //     } catch (error: any) {
  //       console.log(error);
  //       return Promise.resolve(null);
  //     }
  //   };
}
