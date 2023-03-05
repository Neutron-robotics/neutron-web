import { InputHandlerDefinedAction, DefaultGamepad } from "hotkeys-inputs-js/";

const neutronDefault: InputHandlerDefinedAction = {
  direction: [
    { type: "keyboard", key: "w", options: { event: "repeat", value: 1 } },
    { type: "keyboard", key: "s", options: { event: "repeat", value: -1 } },
    {
      type: "gamepad",
      key: DefaultGamepad.LeftJoystickAxeY,
      options: { event: "changed", value: -1 },
    },
  ],
  rotation: [
    { type: "keyboard", key: "d", options: { event: "repeat", value: 1 } },
    { type: "keyboard", key: "a", options: { event: "repeat", value: -1 } },
    {
      type: "gamepad",
      key: DefaultGamepad.LeftJoystickAxeX,
      options: { event: "changed", value: 10 },
    },
  ],
  stop: [
    { type: "keyboard", key: "space", options: { event: "pressed" } },
    {
      type: "gamepad",
      key: DefaultGamepad.KeyB,
      options: { event: "pressed" },
    },
  ],
  speed: [
    {
      type: "keyboard",
      key: "left",
      options: { event: "pressed", value: -10 },
    },
    {
      type: "keyboard",
      key: "right",
      options: { event: "pressed", value: 10 },
    },
    {
      type: "gamepad",
      key: DefaultGamepad.KeyPlus,
      options: { event: "pressed", value: 10 },
    },
    {
      type: "gamepad",
      key: DefaultGamepad.KeyMinus,
      options: { event: "pressed", value: -10 },
    },
  ],
};

export default neutronDefault;
