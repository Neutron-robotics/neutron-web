import CameraComponent from "../src/components/OperationComponents/passive/CameraComponent";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiConnectionContext } from "../src/contexts/MultiConnectionProvider";
import "@testing-library/jest-dom";

describe("CameraComponent", () => {
  var props = {};
  var connectionContextProps = {};

  beforeEach(() => {
    props = {
      moduleId: "mocktest",
      connectionId: "mocktest",
      onCommitComponentSpecific: jest.fn(),
      specifics: {
        isConnected: false,
      },
    };
    connectionContextProps = {
      addConnection: jest.fn(),
      removeConnection: jest.fn(),
      connections: {
        mocktest: {
          modules: [
            {
              id: "mocktest",
              uri: "uri-test",
              isConnected: false,
              connect: jest.fn().mockReturnValue(Promise.resolve(true)),
              disconnect: jest.fn().mockReturnValue(Promise.resolve(true)),
              stop: jest.fn(),
              destroy: jest.fn(),
            },
          ],
        },
      },
    };
  });

  test("The component does not crash if no props", () => {
    render(<CameraComponent />);
  });

  test("the component should render the expected controls", () => {
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <CameraComponent {...props} />
      </MultiConnectionContext.Provider>
    );
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  test("the component initiate without action to be performed", () => {
    const cameraBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <CameraComponent {...props} />
      </MultiConnectionContext.Provider>
    );
    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(cameraBaseMock.id).toBe("mocktest");
    expect(cameraBaseMock.connect).not.toHaveBeenCalled();
    expect(cameraBaseMock.disconnect).not.toHaveBeenCalled();
    expect(cameraBaseMock.stop).not.toHaveBeenCalled();
    expect(cameraBaseMock.destroy).not.toHaveBeenCalled();
  });

  test("the camera api is called when connecting", () => {
    const cameraBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <CameraComponent {...props} />
      </MultiConnectionContext.Provider>
    );

    expect(cameraBaseMock.isConnected).toBe(false);
    const connectBtn = screen.getByLabelText("connect-cmd");
    fireEvent.click(connectBtn);
    expect(cameraBaseMock.connect).toBeCalled();
  });

  test("connect then disconnect", async () => {
    const cameraBaseMock =
      connectionContextProps.connections["mocktest"].modules[0];
    render(
      <MultiConnectionContext.Provider value={connectionContextProps}>
        <CameraComponent {...props} />
      </MultiConnectionContext.Provider>
    );

    const connectBtn = screen.getByLabelText("connect-cmd");
    fireEvent.click(connectBtn);
    expect(cameraBaseMock.connect).toBeCalled();

    const disconnectBtn = await screen.findByText("Disconnect");
    expect(disconnectBtn).toBeInTheDocument();
    fireEvent.click(disconnectBtn);
    expect(cameraBaseMock.disconnect).toBeCalled();

    const connectBtnAgain = await screen.findByLabelText("connect-cmd");
    expect(connectBtnAgain).toBeInTheDocument();
    expect(disconnectBtn).not.toBeInTheDocument();
  });

  test.todo("reconnect from props");
});
