import React, { useEffect } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTabs, useTabsDispatch } from "../src/contexts/TabContext";
import "@testing-library/jest-dom";
import { ViewType } from "../src/contexts/ViewProvider";
import { TabProvider } from "../src/contexts/TabContext";

describe("Tab Provider", () => {
  const makeMockComponent = (props) => {
    const { expectNoTabs } = props;
    const tabsUpdated = jest.fn().mockImplementation();
    const tabBuilderMock = {
      id: "tabmock",
      title: "Tab Mock",
      onClose: jest.fn(),
      onSetActive: jest.fn(),
      viewType: ViewType.OperationView,
      isActive: true,
    };

    const Component = () => {
      const tabs = useTabs();
      const dispatch = useTabsDispatch();

      useEffect(() => {
        if (expectNoTabs) expect(Object.entries(tabs).length).toBe(0);
      }, []);

      useEffect(() => {
        tabsUpdated(tabs);
      }, [tabs]);

      const createTab = () => {
        dispatch({
          type: "create",
          builder: tabBuilderMock,
        });
      };

      const removeTab = () => {
        dispatch({
          type: "remove",
          tabId: tabBuilderMock.id,
        });
      };

      const createComponent = () => {
        dispatch({
          type: "add-component",
          tabId: tabBuilderMock.id,
          payload: {
            builder: {
              id: "buildermock",
              tabId: tabBuilderMock.id,
              name: "Mock Component",
              type: "passive",
              settings: {
                defaultHeight: 300,
                defaultWidth: 300,
              },
              component: jest.fn(),
              onClose: jest.fn(),
            },
            specifics: {
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        });
      };

      const commitComponent = () => {
        dispatch({
          type: "commit",
          payload: { foo: "toto" },
          specifics: { toto: "foo" },
          tabId: tabBuilderMock.id,
          componentId: "buildermock",
        });
      };

      const removeComponent = () => {
        dispatch({
          type: "remove-component",
          tabId: tabBuilderMock.id,
          componentId: "buildermock",
        });
      };

      return (
        <>
          <div>
            {Object.entries(tabs).map(
              ([key, value]) =>
                `${key} ${value.title} ${Object.entries(
                  value.components
                ).reduce(
                  (acc, [curKey, curVal]) =>
                    `${acc} ${curKey} ${curVal.builder.id}`,
                  ""
                )}`
            )}
          </div>
          <button onClick={createTab}>create tab</button>
          <button onClick={removeTab}>remove tab</button>
          <button onClick={createComponent}>create component</button>
          <button onClick={commitComponent}>commit component</button>
          <button onClick={removeComponent}>remove component</button>
        </>
      );
    };
    return {
      MockComponent: Component,
      mocks: {
        tabBuilderMock,
        tabsUpdated,
      },
    };
  };

  test("initialize successfully", () => {
    const { MockComponent } = makeMockComponent({
      expectNoTabs: true,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
  });

  test("create tab successfully", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(2);
    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.any(Function),
        onSetActive: expect.any(Function),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();
  });

  test("create tab errors due to duplicate", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(2);
    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.any(Function),
        onSetActive: expect.any(Function),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();

    fireEvent.click(createBtn);
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(2);
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();
  });

  test("remove tab", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(2);
    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.any(Function),
        onSetActive: expect.any(Function),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();

    const removeBtn = screen.getByText("remove tab");
    fireEvent.click(removeBtn);
    expect(
      screen.queryByText(
        `${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`
      )
    ).not.toBeInTheDocument();
    expect(mocks.tabsUpdated).toHaveBeenCalledWith({});
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(3);
  });

  test("remove unexisting tab", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(1);
    const removeBtn = screen.getByText("remove tab");
    fireEvent.click(removeBtn);
    expect(mocks.tabsUpdated).toHaveBeenLastCalledWith({});
  });

  test("create component successfully", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.anything(),
        onSetActive: expect.anything(),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);

    const createComponentBtn = screen.getByText("create component");
    fireEvent.click(createComponentBtn);
    const tabscomponentsUpdated = {
      tabmock: {
        components: {
          buildermock: {
            builder: {
              component: jest.fn(),
              id: "buildermock",
              onClose: jest.fn(),
              tabId: "tabmock",
              name: "Mock Component",
              type: "passive",
              settings: {
                defaultHeight: 300,
                defaultWidth: 300,
              },
            },
            specifics: {
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        },
        id: "tabmock",
        onClose: jest.fn(),
        onSetActive: jest.fn(),
        title: "Tab Mock",
        viewType: 2,
        isActive: true,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(3);

    const args = mocks.tabsUpdated.mock.calls[2][0];
    expect(JSON.stringify(args)).toBe(JSON.stringify(tabscomponentsUpdated));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();
  });

  test("create component errors due to duplicate", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.anything(),
        onSetActive: expect.anything(),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);

    const createComponentBtn = screen.getByText("create component");
    fireEvent.click(createComponentBtn);
    const tabscomponentsUpdated = {
      tabmock: {
        components: {
          buildermock: {
            builder: {
              component: jest.fn(),
              id: "buildermock",
              onClose: jest.fn(),
              tabId: "tabmock",
              name: "Mock Component",
              type: "passive",
              settings: {
                defaultHeight: 300,
                defaultWidth: 300,
              },
            },
            specifics: {
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        },
        id: "tabmock",
        onClose: jest.fn(),
        onSetActive: jest.fn(),
        title: "Tab Mock",
        viewType: 2,
        isActive: true,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(3);

    const args = mocks.tabsUpdated.mock.calls[2][0];
    expect(JSON.stringify(args)).toBe(JSON.stringify(tabscomponentsUpdated));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();

    fireEvent.click(createComponentBtn);

    const args4 = mocks.tabsUpdated.mock.calls[3][0];
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(4);
    expect(JSON.stringify(args4)).toBe(JSON.stringify(tabscomponentsUpdated));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();
  });

  test("remove component successfully", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.anything(),
        onSetActive: expect.anything(),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);

    const createComponentBtn = screen.getByText("create component");
    fireEvent.click(createComponentBtn);
    const tabscomponentsUpdated = {
      tabmock: {
        components: {
          buildermock: {
            builder: {
              component: jest.fn(),
              id: "buildermock",
              onClose: jest.fn(),
              tabId: "tabmock",
              name: "Mock Component",
              type: "passive",
              settings: {
                defaultHeight: 300,
                defaultWidth: 300,
              },
            },
            specifics: {
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        },
        id: "tabmock",
        onClose: jest.fn(),
        onSetActive: jest.fn(),
        title: "Tab Mock",
        viewType: 2,
        isActive: true,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(3);

    const args = mocks.tabsUpdated.mock.calls[2][0];
    expect(JSON.stringify(args)).toBe(JSON.stringify(tabscomponentsUpdated));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();

    const removeComponentBtn = screen.getByText("remove component");
    fireEvent.click(removeComponentBtn);

    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();
    expect(mocks.tabsUpdated).toHaveBeenLastCalledWith(tabsUpdated);
  });

  test("remove unexisting component", () => {
    const { MockComponent } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);
    const removeComponentBtn = screen.getByText("remove component");
    fireEvent.click(removeComponentBtn);

    expect(screen.getByText(`tabmock Tab Mock`)).toBeInTheDocument();
  });

  test("remove component from unexisting tab", () => {
    const { MockComponent } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const removeComponentBtn = screen.getByText("remove component");
    fireEvent.click(removeComponentBtn);

    expect(screen.queryByText(`tabmock Tab Mock`)).not.toBeInTheDocument();
  });

  test("commit component specifics successfully", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.anything(),
        onSetActive: expect.anything(),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);

    const createComponentBtn = screen.getByText("create component");
    fireEvent.click(createComponentBtn);
    const tabscomponentsUpdated = {
      tabmock: {
        components: {
          buildermock: {
            builder: {
              component: jest.fn(),
              id: "buildermock",
              onClose: jest.fn(),
              tabId: "tabmock",
              name: "Mock Component",
              type: "passive",
              settings: {
                defaultHeight: 300,
                defaultWidth: 300,
              },
            },
            specifics: {
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        },
        id: "tabmock",
        onClose: jest.fn(),
        onSetActive: jest.fn(),
        title: "Tab Mock",
        viewType: 2,
        isActive: true,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(3);

    const args = mocks.tabsUpdated.mock.calls[2][0];
    expect(JSON.stringify(args)).toBe(JSON.stringify(tabscomponentsUpdated));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();

    const commitComponentBtn = screen.getByText("commit component");
    fireEvent.click(commitComponentBtn);
    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(4);

    const tabsComponentCommited = {
      tabmock: {
        components: {
          buildermock: {
            builder: {
              component: jest.fn(),
              id: "buildermock",
              onClose: jest.fn(),
              tabId: "tabmock",
              name: "Mock Component",
              type: "passive",
              settings: {
                foo: "toto",
                defaultHeight: 300,
                defaultWidth: 300,
              },
            },
            specifics: {
              toto: "foo",
              connectionId: "connectionidmock",
              moduleId: "buildermock",
              onCommitComponentSpecific: jest.fn(),
            },
          },
        },
        id: "tabmock",
        onClose: jest.fn(),
        onSetActive: jest.fn(),
        title: "Tab Mock",
        viewType: 2,
        isActive: true,
      },
    };
    const args2 = mocks.tabsUpdated.mock.calls[3][0];
    expect(JSON.stringify(args2, Object.keys(args2).sort())).toBe(JSON.stringify(tabsComponentCommited, Object.keys(tabsComponentCommited).sort()));
    expect(
      screen.getByText("tabmock Tab Mock buildermock buildermock")
    ).toBeInTheDocument();
  });

  test("commit component specifics from unexisting tab", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );

    const commitComponentBtn = screen.getByText("commit component");
    fireEvent.click(commitComponentBtn);

    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(1);
    expect(mocks.tabsUpdated).toHaveBeenCalledWith({});
    expect(
      screen.queryByText("tabmock Tab Mock buildermock buildermock")
    ).not.toBeInTheDocument();
  });

  test("commit component specifics from unexisting component", () => {
    const { MockComponent, mocks } = makeMockComponent({
      expectNoTabs: false,
    });
    render(
      <TabProvider>
        <MockComponent />
      </TabProvider>
    );
    const createBtn = screen.getByText("create tab");
    fireEvent.click(createBtn);

    expect(mocks.tabsUpdated).toHaveBeenCalledTimes(2);
    const tabsUpdated = {
      tabmock: {
        components: {},
        id: "tabmock",
        onClose: expect.any(Function),
        onSetActive: expect.any(Function),
        isActive: true,
        title: "Tab Mock",
        viewType: 2,
      },
    };
    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();

    const commitComponentBtn = screen.getByText("commit component");
    fireEvent.click(commitComponentBtn);

    expect(mocks.tabsUpdated).toHaveBeenCalledWith(tabsUpdated);
    expect(
      screen.getByText(`${tabsUpdated.tabmock.id} ${tabsUpdated.tabmock.title}`)
    ).toBeInTheDocument();
  });
});
