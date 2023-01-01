import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewManager from "../src/views/ViewManager";
import { TabProvider } from "../src/contexts/TabContext";

describe("View Manager", () => {
  test("ViewManager render successfuly", async () => {
    render(<ViewManager />);
    const t = await screen.findByText(/Connect to a robot/);
    expect(t).toBeVisible();
  });

  test("ViewManager click home", async () => {
    render(
      <TabProvider>
        <ViewManager />
      </TabProvider>
    );
    const button = await screen.findByLabelText("home-menu");
    fireEvent.click(button);
    expect(button).toBeVisible();
  });
});
