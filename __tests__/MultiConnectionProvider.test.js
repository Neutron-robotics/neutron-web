import React, { useEffect, useState } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  MultiConnectionProvider,
  MultiConnectionContext,
} from "../src/contexts/MultiConnectionProvider";
import { Core, RobotConnectionType } from "neutron-core";
import { wait } from "@testing-library/user-event/dist/utils";

describe("MultiConnectionProvider", () => {
  const makeMockComponent = (props) => {
    const core = props.core
      ? new Core({
          hostname: "toto",
          port: 8080,
          type: RobotConnectionType.ROSBRIDGE,
        })
      : null;
    if (core) {
      core.type = RobotConnectionType.ROSBRIDGE;
      core.getProcessesStatus = props.coreOnGetProcessesStatus;
      core.startRobotProcess = props.coreOnStartRobotProcess;
      core.stopProcesses = props.coreOnStopProcesses;
      core.contextConfiguration = {
        hostname: "toto",
        port: 8080,
        type: RobotConnectionType.ROSBRIDGE,
      };
    }
    const context = props.context
      ? {
          type: RobotConnectionType.ROSBRIDGE,
          connect: props.contextConnectFn,
          disconnect: props.contextDisconnectFn,
        }
      : null;
    const connectionMock = [
      {
        configuration: {},
        id: "toto",
        name: "mock",
        type: "robotbase",
      },
    ];
    return () => {
      const { addConnection, removeConnection } = React.useContext(
        MultiConnectionContext
      );
      const [connectionId, setConnectionId] = useState(props.connectionId);
      useEffect(() => {
        if (connectionId) return;

        if (props.testAddConnection === "success")
          addConnection(core, context, connectionMock).then((r) => {
            expect(r).toBe(true);
            setConnectionId(core.id);
          });
        if (props.testAddConnection === "fail")
          addConnection(core, context, connectionMock).then((r) => {
            expect(r).toBe(false);
          });
      }, [addConnection, connectionId]);

      useEffect(() => {
        if (!props.testRemoveConnection || !connectionId) return;
        removeConnection(connectionId);
      }, [removeConnection, connectionId]);
      return <></>;
    };
  };

  test("Use Context", () => {
    render(<MultiConnectionProvider></MultiConnectionProvider>);
  });

  test("Add connection with success", async () => {
    const contextConnectFn = jest.fn().mockReturnValue(Promise.resolve(true));
    const contextDisconnectFn = jest.fn();
    const coreOnGetProcessesStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    const coreOnStartRobotProcess = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const ComponentMock = makeMockComponent({
      contextConnectFn,
      contextDisconnectFn,
      coreOnGetProcessesStatus,
      coreOnStartRobotProcess,
      testAddConnection: "success",
      core: true,
      context: true,
    });
    render(
      <MultiConnectionProvider>
        <ComponentMock />
      </MultiConnectionProvider>
    );

    await wait(1000);
    expect(contextDisconnectFn).not.toHaveBeenCalled();
    expect(contextConnectFn).toHaveBeenCalledTimes(1);
    expect(coreOnStartRobotProcess).toHaveBeenCalledTimes(1);
    expect(coreOnGetProcessesStatus).toHaveBeenCalledTimes(1);
  });

  test("Add connection failure (no core)", async () => {
    const contextConnectFn = jest.fn().mockReturnValue(Promise.resolve(true));
    const contextDisconnectFn = jest.fn();
    const coreOnGetProcessesStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    const coreOnStartRobotProcess = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const ComponentMock = makeMockComponent({
      contextConnectFn,
      contextDisconnectFn,
      coreOnGetProcessesStatus,
      coreOnStartRobotProcess,
      testAddConnection: "fail",
      core: false,
      context: true,
    });
    render(
      <MultiConnectionProvider>
        <ComponentMock />
      </MultiConnectionProvider>
    );

    await wait(1000);
    expect(contextDisconnectFn).not.toHaveBeenCalled();
    expect(contextConnectFn).not.toHaveBeenCalled();
    expect(coreOnStartRobotProcess).not.toHaveBeenCalled();
    expect(coreOnGetProcessesStatus).not.toHaveBeenCalled();
  });

  test("Add connection failure (no context)", async () => {
    const contextConnectFn = jest.fn().mockReturnValue(Promise.resolve(true));
    const contextDisconnectFn = jest.fn();
    const coreOnGetProcessesStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    const coreOnStartRobotProcess = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const ComponentMock = makeMockComponent({
      contextConnectFn,
      contextDisconnectFn,
      coreOnGetProcessesStatus,
      coreOnStartRobotProcess,
      testAddConnection: "fail",
      core: true,
      context: false,
    });
    render(
      <MultiConnectionProvider>
        <ComponentMock />
      </MultiConnectionProvider>
    );

    await wait(1000);
    expect(contextDisconnectFn).not.toHaveBeenCalled();
    expect(contextConnectFn).not.toHaveBeenCalled();
    expect(coreOnStartRobotProcess).not.toHaveBeenCalled();
    expect(coreOnGetProcessesStatus).not.toHaveBeenCalled();
  });

  test("Remove existing connection", async () => {
    const contextConnectFn = jest.fn().mockReturnValue(Promise.resolve(true));
    const contextDisconnectFn = jest.fn();
    const coreOnStopProcesses = jest.fn();
    const coreOnGetProcessesStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    const coreOnStartRobotProcess = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const ComponentMock = makeMockComponent({
      contextConnectFn,
      contextDisconnectFn,
      coreOnGetProcessesStatus,
      coreOnStartRobotProcess,
      coreOnStopProcesses,
      testAddConnection: "success",
      core: true,
      context: true,
      testRemoveConnection: true,
    });
    render(
      <MultiConnectionProvider>
        <ComponentMock />
      </MultiConnectionProvider>
    );

    await wait(1000);
    expect(contextDisconnectFn).toHaveBeenCalledTimes(1);
    expect(coreOnStopProcesses).toHaveBeenCalledTimes(1);
    expect(contextConnectFn).toHaveBeenCalled();
    expect(coreOnStartRobotProcess).toHaveBeenCalled();
    expect(coreOnGetProcessesStatus).toHaveBeenCalled();
  });

  test("Remove connection failure", async () => {
    const contextConnectFn = jest.fn().mockReturnValue(Promise.resolve(true));
    const contextDisconnectFn = jest.fn();
    const coreOnStopProcesses = jest.fn();
    const coreOnGetProcessesStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve());
    const coreOnStartRobotProcess = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const ComponentMock = makeMockComponent({
      contextConnectFn,
      contextDisconnectFn,
      coreOnGetProcessesStatus,
      coreOnStartRobotProcess,
      coreOnStopProcesses,
      core: true,
      context: true,
      testRemoveConnection: true,
      connectionId: "I does not exist!",
    });
    render(
      <MultiConnectionProvider>
        <ComponentMock />
      </MultiConnectionProvider>
    );

    await wait(1000);
    expect(contextDisconnectFn).not.toHaveBeenCalled();
    expect(contextConnectFn).not.toHaveBeenCalled();
    expect(coreOnStartRobotProcess).not.toHaveBeenCalled();
    expect(coreOnGetProcessesStatus).not.toHaveBeenCalled();
    expect(coreOnStopProcesses).not.toHaveBeenCalled();
  });
});
