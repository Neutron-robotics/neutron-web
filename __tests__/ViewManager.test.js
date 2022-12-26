import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewManager from "../src/views/ViewManager";

test("ViewManager render successfuly", async () => {
  render(<ViewManager />);
  const t = await screen.findByText(/Connect to a robot/);
  expect(t).toBeVisible();
});

test("ViewManager click home", async () => {
  render(<ViewManager />);
  const button = await screen.findByLabelText("home-menu");
  fireEvent.click(button);
  expect(button).toBeVisible();
});

 test.todo("One robot connection displayed") //, () => {
//   render(<ViewManager />);

//   const coreInfos = {
//     hostname: "192.168.1.1",
//     port: "9090",
//     type: RobotConnectionType.ROSBRIDGE,
//   };
//   const core = new Core(coreInfos);
//   core.contextConfiguration = coreInfos;
//   core.modules = [
//     {
//       id: "base",
//       name: "base",
//       type: "robotbase",
//     },
//   ];

//   act(() => {
//     // eslint-disable-next-line no-undef
//     setCoreConnections([core]);
//   });
// });
