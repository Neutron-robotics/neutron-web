import RobotBase, { Direction, IRobotBaseConfiguration } from "./RobotBase";
import RosContext from "./RosContext";

export default class OsoyooBaseROS extends RobotBase {
  private cleanKeepAliveInterval?: () => void;

  protected override context: RosContext;

  constructor(
    id: string,
    name: string,
    configuration: IRobotBaseConfiguration,
    context: RosContext
  ) {
    super(id, name, configuration);
    this.context = context;
  }

  public move(direction: Direction) {
    if (direction === "left" || direction === "right")
      throw new Error("Invalid direction for move command");

    this.context.publishOnce("/move", "std_msgs/String", {
      data: `${direction}`,
    });
    this.setKeepAlive();
  }

  public rotate(direction: Direction) {
    if (direction === "forward" || direction === "backward")
      throw new Error("Invalid direction for rotate command");

    this.context.publishOnce("/rotate", "std_msgs/String", {
      data: `${direction}`,
    });
    this.setKeepAlive();
  }

  //todo: set this async
  public stop() {
    if (this.cleanKeepAliveInterval) this.cleanKeepAliveInterval();
    this.cleanKeepAliveInterval = undefined;
    this.context.publishOnce("/stop", "std_msgs/String", {
      data: "stop",
    });
  }

  private setKeepAlive() {
    if (!this.cleanKeepAliveInterval) return;
    this.cleanKeepAliveInterval = this.context.publishLoop(
      "/keep_alive",
      "std_msgs/String",
      {
        data: "forward",
      },
      5
    );
  }
}
