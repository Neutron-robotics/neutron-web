import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
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
    expect(mountComponentMock).toHaveBeenCalledWith({...mockComponent, moduleId: "mock-module"});
  });
});
