import { RobotConnectionType } from "neutron-core";

export default function getConnectionType(type: RobotConnectionType): string {
  const robotConnectionTypeDict: Record<RobotConnectionType, string> = {
    [RobotConnectionType.HTTP]: "Http",
    [RobotConnectionType.TCP]: "Tcp",
    [RobotConnectionType.UDP]: "Udp",
    [RobotConnectionType.ROSBRIDGE]: "Ros",
  };
  return robotConnectionTypeDict[type];
}
