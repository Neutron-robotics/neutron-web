import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RobotBaseComponent } from "../src/components/OperationComponents/active/RobotBaseComponent";
import { MultiConnectionContext } from "../src/contexts/MultiConnectionProvider";

describe("RobotBaseComponent", () => {
  var props = {};
  var connectionContextProps = {};

  beforeEach(() => {
    props = {
      connectionId: "mocktest",
      moduleId: "mocktest",
      specifics: {},
      onCommitComponentSpecific: jest.fn(),
    };
    connectionContextProps = {
      addConnection: jest.fn(),
      removeConnection: jest.fn(),
      connections: {
        mocktest: {
          modules: [
            {
              id: "mocktest",
              move: jest.fn(),
              stop: jest.fn(),
              speed: 100,
            },
          ],
        },
      },
    };
  });

  test("the component should render the expected controls", () => {
    render(<RobotBaseComponent {...props} />);
    expect(screen.getByText("Controls")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByLabelText("forward-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("backward-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("left-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("right-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("stop-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("speed-cmd")).toBeInTheDocument();
    expect(screen.getByLabelText("speed-cmd").getAttribute("value")).toBe("30");
  });

  test("the component initiate without action to be performed", () => {
    const robotBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <RobotBaseComponent {...props} />
      </MultiConnectionContext.Provider>
    );

    expect(robotBaseMock.id).toBe("mocktest");
    expect(robotBaseMock.move).not.toHaveBeenCalled();
    expect(robotBaseMock.stop).not.toHaveBeenCalled();
    expect(robotBaseMock.speed).toBe(100);
    expect(screen.getByLabelText("speed-cmd").getAttribute("value")).toBe(
      "100"
    );
  });

  test("the robot api is called when button get pressed", () => {
    console.log(connectionContextProps);
    const robotBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <RobotBaseComponent {...props} />
      </MultiConnectionContext.Provider>
    );

    const forwardBtn = screen.getByLabelText("forward-cmd");
    const backwardBtn = screen.getByLabelText("backward-cmd");
    const leftBtn = screen.getByLabelText("left-cmd");
    const rightBtn = screen.getByLabelText("right-cmd");
    const stopBtn = screen.getByLabelText("stop-cmd");
    const speedSlider = screen.getByLabelText("speed-cmd");

    console.log("1");
    fireEvent.click(backwardBtn);
    expect(robotBaseMock.move).toBeCalledWith([-1, 0, 0, 0, 0, 0]);
    fireEvent.click(forwardBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0]);
    console.log("2");
    fireEvent.click(leftBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, -0.1]);
    fireEvent.click(rightBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0]);

    expect(robotBaseMock.stop).not.toBeCalled();
    fireEvent.click(stopBtn);
    expect(robotBaseMock.stop).toBeCalled();
    fireEvent.change(speedSlider, { target: { value: "20" } });
    expect(speedSlider.value).toBe("20");
    expect(robotBaseMock.speed).toBe(20);
  });

  test("the robot api is handling changes of direction", () => {
    console.log(connectionContextProps);
    const robotBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <RobotBaseComponent {...props} />
      </MultiConnectionContext.Provider>
    );

    const forwardBtn = screen.getByLabelText("forward-cmd");
    const leftBtn = screen.getByLabelText("left-cmd");
    const rightBtn = screen.getByLabelText("right-cmd");
    const stopBtn = screen.getByLabelText("stop-cmd");

    fireEvent.click(forwardBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0]);
    fireEvent.click(leftBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, -0.1]);
    fireEvent.click(leftBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, -0.2]);

    fireEvent.click(forwardBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0]);

    fireEvent.click(rightBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0.1]);
    fireEvent.click(rightBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0.2]);
    fireEvent.click(rightBtn);
    expect(robotBaseMock.move).toBeCalledWith([1, 0, 0, 0, 0, 0.3]);

    expect(robotBaseMock.stop).not.toBeCalled();
    fireEvent.click(stopBtn);
    expect(robotBaseMock.stop).toBeCalled();
  });
});
