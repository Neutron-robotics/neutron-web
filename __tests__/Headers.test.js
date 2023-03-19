import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../src/components/Header/Header";
import {
  ViewProvider,
  ViewContext,
  ViewType,
} from "../src/contexts/ViewProvider";
import { ThemeProvider } from "@mui/material";
import neutronMuiThemeDefault from "../src/contexts/MuiTheme";
import OperationHeader from "../src/components/Header/OperationHeader";
import { MultiConnectionContext } from "../src/contexts/MultiConnectionProvider";
import { TabsDispatchContext } from "../src/contexts/TabContext";
import OperationMenuPanel from "../src/components/Header/OperationPanel";
import { v4 } from "uuid";

describe("Header", () => {
  test("Initialize without tabId nor headerBody", () => {
    render(
      <ViewProvider>
        <ThemeProvider theme={neutronMuiThemeDefault}>
          <Header headerTabs={[]} />
        </ThemeProvider>
      </ViewProvider>
    );
  });

  test("Initialize with tab and headerBody", () => {
    const onMountComponentMock = jest.fn();
    const addConnection = jest.fn();
    const removeConnection = jest.fn();
    const connections = {
      "mock-tab-id": {
        context: jest.mock(),
        core: jest.mock(),
        modules: [],
      },
    };

    render(
      <ViewProvider>
        <MultiConnectionContext.Provider
          value={{ addConnection, removeConnection, connections }}
        >
          <ThemeProvider theme={neutronMuiThemeDefault}>
            <Header
              headerTabs={[
                {
                  id: "mock-tab-id-xxx",
                  components: {},
                  title: "mock-tab-id",
                  onClose: jest.fn(),
                  onSetActive: jest.fn(),
                  isActive: true,
                  viewType: ViewType.OperationView,
                },
              ]}
              activeTabId={"mock-tab-id"}
              headerBody={
                <OperationHeader
                  mountComponent={onMountComponentMock}
                  operationCategories={[]}
                  connectionId={"mock-tab-id"}
                />
              }
            />
          </ThemeProvider>
        </MultiConnectionContext.Provider>
      </ViewProvider>
    );

    expect(screen.getByText("mock-tab-id")).toBeInTheDocument();
  });

  test("Click home", () => {
    const setViewType = jest.fn();
    const dispatch = jest.fn();

    render(
      <ViewContext.Provider value={{ setViewType }}>
        <TabsDispatchContext.Provider value={dispatch}>
          <ThemeProvider theme={neutronMuiThemeDefault}>
            <Header headerTabs={[]} />
          </ThemeProvider>
        </TabsDispatchContext.Provider>
      </ViewContext.Provider>
    );
    const homeBtn = screen.getByLabelText("home-menu");
    expect(dispatch).not.toHaveBeenCalled();
    expect(setViewType).not.toHaveBeenCalled();
    fireEvent.click(homeBtn);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(setViewType).toHaveBeenCalledTimes(1);
  });
});

describe("OperationHeader", () => {
  test("Initialize with no components", () => {
    const mountComponentMock = jest.fn();
    const setViewType = jest.fn();
    const dispatch = jest.fn();
    const addConnection = jest.fn();
    const removeConnection = jest.fn();
    const connections = {
      "mock-tab-id": {
        context: jest.mock(),
        core: jest.mock(),
        modules: [],
      },
    };

    render(
      <TabsDispatchContext.Provider value={dispatch}>
        <ViewContext.Provider value={{ setViewType }}>
          <MultiConnectionContext.Provider
            value={{ addConnection, removeConnection, connections }}
          >
            <ThemeProvider theme={neutronMuiThemeDefault}>
              <OperationHeader
                mountComponent={mountComponentMock}
                operationCategories={[]}
                connectionId={"mock-tab-id"}
              />
            </ThemeProvider>
          </MultiConnectionContext.Provider>
        </ViewContext.Provider>
      </TabsDispatchContext.Provider>
    );

    expect(mountComponentMock).not.toHaveBeenCalled();
    expect(setViewType).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(addConnection).not.toHaveBeenCalled();
    expect(removeConnection).not.toHaveBeenCalled();

    const mainMenuBtn = screen.getByLabelText("main-menu-btn");
    const batteryInfo = screen.getByLabelText("battery-info");
    const wifiInfo = screen.getByLabelText("wifi-info");
    expect(mainMenuBtn).toBeInTheDocument();
    expect(batteryInfo).toBeInTheDocument();
    expect(wifiInfo).toBeInTheDocument();
  });

  test("Mount components from operation categories", async () => {
    const mountComponentMock = jest.fn();
    const setViewType = jest.fn();
    const dispatch = jest.fn();
    const addConnection = jest.fn();
    const removeConnection = jest.fn();
    const connections = {
      "mock-tab-id": {
        context: jest.mock(),
        core: {
          getRobotStatus: jest.fn().mockResolvedValue({
            battery: -1,
            cpu: 0,
            memory: 0,
            operationTime: -1,
            time: 0,
            modules: [],
          }),
        },
        modules: [],
      },
    };
    const mockComponent = {
      name: "mock1component",
      type: "active",
      partType: "toto",
      component: () => {},
      icon: <div />,
      settings: {},
    };

    render(
      <TabsDispatchContext.Provider value={dispatch}>
        <ViewContext.Provider value={{ setViewType }}>
          <MultiConnectionContext.Provider
            value={{ addConnection, removeConnection, connections }}
          >
            <ThemeProvider theme={neutronMuiThemeDefault}>
              <OperationHeader
                mountComponent={mountComponentMock}
                operationCategories={[
                  {
                    name: "mock1",
                    type: "utils",
                    icon: <div></div>,
                    components: [mockComponent],
                  },
                ]}
                connectionId={"mock-tab-id"}
              />
            </ThemeProvider>
          </MultiConnectionContext.Provider>
        </ViewContext.Provider>
      </TabsDispatchContext.Provider>
    );

    const utilsPartCard = screen.getByLabelText("mock1-iconbtn");
    expect(utilsPartCard).toBeInTheDocument();
    fireEvent.click(utilsPartCard);
    const componentButton = await screen.findByText("mock1component");
    expect(componentButton).toBeInTheDocument();
    expect(mountComponentMock).not.toHaveBeenCalled();
    fireEvent.click(componentButton);
    expect(mountComponentMock).toHaveBeenCalledTimes(1);
    expect(mountComponentMock).toHaveBeenCalledWith(mockComponent);
  });

  test("Mount components from operation categories 2", async () => {
    const mountComponentMock = jest.fn();
    const setViewType = jest.fn();
    const dispatch = jest.fn();
    const addConnection = jest.fn();
    const removeConnection = jest.fn();
    const connections = {
      "mock-tab-id": {
        context: jest.mock(),
        core: {
          getRobotStatus: jest.fn().mockResolvedValue({
            battery: -1,
            cpu: 0,
            memory: 0,
            operationTime: -1,
            time: 0,
            modules: [],
          }),
        },
        modules: [
          {
            id: "mock-module",
            name: "mock",
            type: "toto",
          },
        ],
      },
    };
    const mockComponent = {
      name: "mock1component",
      type: "active",
      partType: "toto",
      component: () => {},
      icon: <div />,
      settings: {},
    };
    const mockComponent2 = {
      name: "mock2component",
      type: "passive",
      partType: "umknown",
      component: () => {},
      icon: <div />,
      settings: {},
    };

    render(
      <TabsDispatchContext.Provider value={dispatch}>
        <ViewContext.Provider value={{ setViewType }}>
          <MultiConnectionContext.Provider
            value={{ addConnection, removeConnection, connections }}
          >
            <ThemeProvider theme={neutronMuiThemeDefault}>
              <OperationHeader
                mountComponent={mountComponentMock}
                operationCategories={[
                  {
                    name: "mock1",
                    type: "utils",
                    icon: <div></div>,
                    components: [mockComponent, mockComponent2],
                  },
                  {
                    name: "mock2",
                    type: "undefined",
                    icon: <div></div>,
                    components: [],
                  },
                ]}
                connectionId={"mock-tab-id"}
              />
            </ThemeProvider>
          </MultiConnectionContext.Provider>
        </ViewContext.Provider>
      </TabsDispatchContext.Provider>
    );

    const utilsPartCard = screen.getByLabelText("mock1-iconbtn");
    expect(utilsPartCard).toBeInTheDocument();
    fireEvent.click(utilsPartCard);
    const componentButton = await screen.findByText("mock1component");
    expect(componentButton).toBeInTheDocument();
    expect(mountComponentMock).not.toHaveBeenCalled();
    fireEvent.click(componentButton);
    expect(mountComponentMock).toHaveBeenCalledTimes(1);
    expect(mountComponentMock).toHaveBeenCalledWith({
      ...mockComponent,
      moduleId: "mock-module",
    });
  });
});

describe("Operation menu panel", () => {
  const makeModule = (name, active) => ({
    id: v4(),
    name,
    type: "osef",
    framePackage: "osef",
    configuration: {},
    process: {
      cpu: 0,
      mem: 0,
      mem_usage: 0,
      active,
      pid: 0,
      name: "osef",
      id: "osef",
    },
  });

  const delay = (ms) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, ms);
    });
  };

  test("component initialize properly without modules", () => {
    const onShutDownClickMock = jest.fn();
    const onModuleSwitchClickMock = jest.fn();
    render(
      <OperationMenuPanel
        cpu={8}
        ram={50}
        modules={[]}
        name={"robot"}
        operationStartTime={new Date().getTime()}
        onShutdownClick={onShutDownClickMock}
        onModuleSwitchClick={onModuleSwitchClickMock}
      />
    );

    expect(onShutDownClickMock).not.toHaveBeenCalled();
    expect(onModuleSwitchClickMock).not.toHaveBeenCalled();
    expect(screen.getByText("8%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("component initialize properly with modules", () => {
    const modules = [
      makeModule("module-mock-1", true),
      makeModule("module-mock-2", true),
      makeModule("module-mock-3", false),
    ];

    const onShutDownClickMock = jest.fn();
    const onModuleSwitchClickMock = jest.fn();
    render(
      <OperationMenuPanel
        cpu={8}
        ram={50}
        modules={modules}
        name={"robot"}
        operationStartTime={new Date().getTime()}
        onShutdownClick={onShutDownClickMock}
        onModuleSwitchClick={onModuleSwitchClickMock}
      />
    );

    expect(onShutDownClickMock).not.toHaveBeenCalled();
    expect(onModuleSwitchClickMock).not.toHaveBeenCalled();
    expect(screen.getByText("8%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("module-mock-1")).toBeInTheDocument();
    expect(screen.getByText("module-mock-2")).toBeInTheDocument();
    expect(screen.getByText("module-mock-3")).toBeInTheDocument();
    expect(screen.getByText("module-mock-1")).toBeInTheDocument();

    const moduleMock1 = screen.getByText("module-mock-1");
    // eslint-disable-next-line testing-library/no-node-access
    const parent = moduleMock1.parentElement;
    const checkboxInput = within(parent).getByRole("checkbox");
    expect(checkboxInput).toBeChecked();

    const moduleMock2 = screen.getByText("module-mock-2");
    // eslint-disable-next-line testing-library/no-node-access
    const parent2 = moduleMock2.parentElement;
    const checkboxInput2 = within(parent2).getByRole("checkbox");
    expect(checkboxInput2).toBeChecked();

    const moduleMock3 = screen.getByText("module-mock-3");
    // eslint-disable-next-line testing-library/no-node-access
    const parent3 = moduleMock3.parentElement;
    const checkboxInput3 = within(parent3).getByRole("checkbox");
    expect(checkboxInput3).not.toBeChecked();
  });

  test("press shutdown", () => {
    const onShutDownClickMock = jest.fn();
    const onModuleSwitchClickMock = jest.fn();
    render(
      <OperationMenuPanel
        cpu={8}
        ram={50}
        modules={[]}
        name={"robot"}
        operationStartTime={new Date().getTime()}
        onShutdownClick={onShutDownClickMock}
        onModuleSwitchClick={onModuleSwitchClickMock}
      />
    );

    const shutdownButton = screen.getByText("SHUT DOWN");
    fireEvent.click(shutdownButton);
    expect(onShutDownClickMock).toHaveBeenCalled();
    expect(onModuleSwitchClickMock).not.toHaveBeenCalled();
  });

  test("enable and disable modules", async () => {
    const modules = [
      makeModule("module-mock-1", true),
      makeModule("module-mock-2", true),
      makeModule("module-mock-3", false),
    ];

    const onShutDownClickMock = jest.fn();
    const onModuleSwitchClickMock = jest.fn().mockReturnValue(delay(500));
    render(
      <OperationMenuPanel
        cpu={8}
        ram={50}
        modules={modules}
        name={"robot"}
        operationStartTime={new Date().getTime()}
        onShutdownClick={onShutDownClickMock}
        onModuleSwitchClick={onModuleSwitchClickMock}
      />
    );

    const moduleMock1 = screen.getByText("module-mock-1");
    // eslint-disable-next-line testing-library/no-node-access
    const parent = moduleMock1.parentElement;
    const checkboxInput = within(parent).getByRole("checkbox");
    expect(checkboxInput).toBeChecked();
    fireEvent.click(checkboxInput);
    expect(checkboxInput).toBeDisabled();
    expect(onModuleSwitchClickMock).toHaveBeenCalledTimes(1);
    expect(onModuleSwitchClickMock).toHaveBeenCalledWith(modules[0].id, false);
    await delay(600);
    expect(checkboxInput).not.toBeDisabled();
    expect(checkboxInput).not.toBeChecked();
  });
});
