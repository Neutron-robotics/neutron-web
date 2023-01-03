import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import RobotConnection from "../src/components/Connection/RobotConnection";
import { RobotStatus, RobotConnectionType } from "neutron-core";

describe("RobotConnection", () => {
  let mockCoreConnection;
  let mockHandleOnRobotConnect;

  beforeEach(() => {
    mockCoreConnection = {
      name: "mock",
      status: RobotStatus.Available,
      type: "unknown",
      contextConfiguration: {
        type: RobotConnectionType.ROSBRIDGE,
        hostname: "mockhost",
        port: 8000,
      },
      modules: [
        {
          type: "base",
          title: "mockbase",
          id: "sijasi",
        },
        {
          type: "service",
          title: "mockbase2",
          id: "sisdwsdfejasi",
        },
      ],
    };
    mockHandleOnRobotConnect = jest.fn();
  });
  test("Initialize", () => {
    render(
      <RobotConnection
        coreConnection={mockCoreConnection}
        handleOnRobotConnect={mockHandleOnRobotConnect}
      />
    );

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(mockHandleOnRobotConnect).not.toHaveBeenCalled();
    expect(mockHandleOnRobotConnect).not.toHaveBeenCalled();
    expect(screen.queryByText("Connection")).not.toBeInTheDocument();
    expect(screen.queryByText("Host")).not.toBeInTheDocument();
    expect(screen.queryByText("mockhost")).not.toBeInTheDocument();
    expect(screen.queryByText("Port")).not.toBeInTheDocument();
    expect(screen.queryByText("8000")).not.toBeInTheDocument();
  });

  test("Open modal when button is pressed", async () => {
    render(
      <RobotConnection
        coreConnection={mockCoreConnection}
        handleOnRobotConnect={mockHandleOnRobotConnect}
      />
    );

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(mockHandleOnRobotConnect).not.toHaveBeenCalled();

    const connectBtn = screen.getByText("Connect");
    fireEvent.click(connectBtn);
    expect(mockHandleOnRobotConnect).not.toHaveBeenCalled();
    expect(await screen.findByText("Connection")).toBeInTheDocument();
    expect(await screen.findByText("Host")).toBeInTheDocument();
    expect(await screen.findByText("mockhost")).toBeInTheDocument();
    expect(await screen.findByText("Port")).toBeInTheDocument();
    expect(await screen.findByText("8000")).toBeInTheDocument();
  });
});
