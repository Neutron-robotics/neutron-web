import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabHeader from "../src/components/Header/TabHeader";
import { ViewType } from "../src/contexts/ViewProvider";

describe("TabHeader", () => {
  let operationTabMock;

  beforeEach(() => {
    operationTabMock = {
      id: "wdwddw",
      components: [],
      title: "mock",
      onClose: jest.fn(),
      onSetActive: jest.fn(),
      isActive: true,
      viewType: ViewType.OperationView,
    };
  });

  test("Initialize", () => {
    render(<TabHeader {...operationTabMock} />);

    expect(screen.getByText("mock")).toBeInTheDocument();
    expect(operationTabMock.onClose).not.toHaveBeenCalled();
    expect(operationTabMock.onSetActive).not.toHaveBeenCalled();
  });

  test("Set tab active", () => {
    render(<TabHeader {...operationTabMock} isActive={false} />);

    fireEvent.click(screen.getByText("mock"));
    expect(operationTabMock.onSetActive).toHaveBeenCalled();
    expect(operationTabMock.onClose).not.toHaveBeenCalled();
  });

  test("set tab active and then close it", () => {
    render(<TabHeader {...operationTabMock} isActive={false} />);

    fireEvent.click(screen.getByText("mock"));
    expect(operationTabMock.onSetActive).toHaveBeenCalledTimes(1);
    expect(operationTabMock.onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("close-tab"))
    expect(operationTabMock.onClose).toHaveBeenCalled();
    expect(operationTabMock.onSetActive).toHaveBeenCalledTimes(1);
  });
});
