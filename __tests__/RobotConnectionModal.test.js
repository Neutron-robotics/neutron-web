import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RobotConnectionType, RobotStatus } from "neutron-core";
import RobotConnectionModal from "../src/components/Connection/RobotConnectionModal";

describe("Robot connection modal", () => {
  let core;
  const mockOnClose = jest.fn();
  const mockOnConnect = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConnect.mockClear();
    mockOnConnect.mockReturnValue(Promise.resolve(true))
    core = {
      name: "mockCore",
      status: RobotStatus.Available,
      type: "mock",
      contextConfiguration: {
        type: RobotConnectionType.ROSBRIDGE,
        hostname: "mockhost",
        port: 8000,
      },
      modules: [
        {
          id: "mockmoduleid1",
          type: "mockname",
          name: "firstmodule",
        },
        {
          id: "mockmoduleid2",
          type: "mockname2",
          name: "secondmodule",
        },
      ],
    };
  });

  test("Connection modal initialize", () => {
    const coreModified = {
      ...core,
      type: "OsoyooRobot",
    };
    render(
      <RobotConnectionModal
        open={true}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        coreConnection={coreModified}
      />
    );

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("firstmodule")).toBeInTheDocument();
    expect(screen.getByText("mockhost")).toBeInTheDocument();
    expect(screen.getByText("8000")).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnConnect).not.toHaveBeenCalled();
  });

  test("Connection modal initialize with unknown image", () => {
    render(
      <RobotConnectionModal
        open={true}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        coreConnection={core}
      />
    );

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("firstmodule")).toBeInTheDocument();
    expect(screen.getByText("mockhost")).toBeInTheDocument();
    expect(screen.getByText("8000")).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnConnect).not.toHaveBeenCalled();
  });

  test("Connection modal connect", () => {
    render(
      <RobotConnectionModal
        open={true}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        coreConnection={core}
      />
    );

    const connectBtn = screen.getByText("Connect");
    fireEvent.click(connectBtn);
    expect(mockOnConnect).toHaveBeenCalledWith(
      {
        contextConfiguration: { hostname: "mockhost", port: 8000, type: 3 },
        modules: [
          { id: "mockmoduleid1", name: "firstmodule", type: "mockname" },
          {
            id: "mockmoduleid2",
            name: "secondmodule",
            type: "mockname2",
          },
        ],
        name: "mockCore",
        status: "Available",
        type: "mock",
      },
      [
        {
          enabled: true,
          id: "mockmoduleid1",
          name: "firstmodule",
          type: "mockname",
        },
        {
          enabled: true,
          id: "mockmoduleid2",
          name: "secondmodule",
          type: "mockname2",
        },
      ]
    );
    expect(mockOnConnect).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("Connection modal connect to a single component", () => {
    render(
      <RobotConnectionModal
        open={true}
        onClose={mockOnClose}
        onConnect={mockOnConnect}
        coreConnection={core}
      />
    );

    const connectBtn = screen.getByText("Connect");
    const switches = screen.getAllByRole("checkbox");
    const secondSwitch = switches[1];
    fireEvent.click(secondSwitch);
    fireEvent.change(secondSwitch, { target: { checked: "" } });
    fireEvent.click(connectBtn);

    expect(mockOnConnect).toHaveBeenCalledWith(
      {
        contextConfiguration: { hostname: "mockhost", port: 8000, type: 3 },
        modules: [
          { id: "mockmoduleid1", name: "firstmodule", type: "mockname" },
          {
            id: "mockmoduleid2",
            name: "secondmodule",
            type: "mockname2",
          },
        ],
        name: "mockCore",
        status: "Available",
        type: "mock",
      },
      [
        {
          enabled: true,
          id: "mockmoduleid1",
          name: "firstmodule",
          type: "mockname",
        },
      ]
    );
    expect(mockOnConnect).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
