/* eslint-disable no-console */
import moment from "moment";
import LiteEvent from "./LiteEvent";
import { isBlank } from "./String";

export interface ILoggerMessage {
  _id?: string;
  source?: string;
  content: string;
  color: LogType;
  time: Date;
}

export enum LogType {
  DEBUG = "#4f5051",
  ERROR = "#d81a1a",
  INFO = "#387a30",
  WARNING = "#d17e32",
}

export default class Logger {
  private source: string;
  private readonly onLog = new LiteEvent<ILoggerMessage>();

  constructor(source: string) {
    this.source = source;
  }

  public get OnLog() {
    return this.onLog.expose();
  }

  public log(message: string, color: LogType) {
    if (!isBlank(this.source)) {
      this.onLog.trigger({
        color,
        content: message,
        source: this.source,
        time: new Date(),
      });
      console.log(
        `%c[${moment().format("LTS")}][${this.source}] ${message}`,
        `color: ${color}; font-style: normal; font-size: 12px`
      );
    } else {
      this.onLog.trigger({
        color,
        content: message,
        time: new Date(),
      });
      console.log(
        `%c[${moment().format("LTS")}] ${message}`,
        `color: ${color}; font-style: normal; font-size: 12px`
      );
    }
  }

  public logDebug(message: string) {
    this.log(message, LogType.DEBUG);
  }

  public logError(message: string) {
    this.log(message, LogType.ERROR);
  }

  public logInfo(message: string) {
    this.log(message, LogType.INFO);
  }

  public logWarning(message: string) {
    this.log(message, LogType.WARNING);
  }
}
