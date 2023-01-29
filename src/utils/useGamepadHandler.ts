import { useContext, useEffect, useRef } from "react";
import { InputHandlerContext } from "../contexts/InputHandlerContext";

export enum SwitchControllerKeyHandler {
  LeftJoystickAxeX,
  LeftJoystickAxeY,
  RightJoystickAxeX,
  RightJoystickAxeY,
  KeyA = 1,
  KeyB = 0,
  KeyX = 3,
  KeyY = 2,
  KeyUp = 12,
  KeyDown = 13,
  KeyLeft = 14,
  KeyRight = 15,
  KeyR1 = 5,
  KeyR2 = 7,
  KeyL1 = 4,
  KeyL2 = 6,
  KeyStart = 16,
  KeyOpts = 17,
  KeyPlus = 9,
  KeyMinus = 8,
}

const useGamepadHandler = (
  keyHandler: SwitchControllerKeyHandler,
  opts: {
    id?: number;
    onChange?: (value: number) => void;
    onActivate?: () => void;
    onDeactivate?: () => void;
    analogInputStep?: number;
    analogInputMin?: number;
  }
) => {
  const prevRef = useRef(0);
  const { onGamepadUpdate, clearGamepadUpdate } =
    useContext(InputHandlerContext);

  useEffect(() => {
    const {
      id,
      onActivate,
      onDeactivate,
      onChange,
      analogInputStep,
      analogInputMin,
    } = opts;

    const handleGamepadUpdate = (gamepad: Gamepad) => {
      let current;
      switch (keyHandler) {
        case SwitchControllerKeyHandler.LeftJoystickAxeX:
          current = gamepad.axes[0];
          break;
        case SwitchControllerKeyHandler.LeftJoystickAxeY:
          current = gamepad.axes[0];
          break;
        case SwitchControllerKeyHandler.RightJoystickAxeX:
          current = gamepad.axes[0];
          break;
        case SwitchControllerKeyHandler.RightJoystickAxeY:
          current = gamepad.axes[0];
          break;
        default:
          current = gamepad.buttons[keyHandler].value;
          break;
      }

      if (
        current < (analogInputMin ?? 0.15) &&
        current > -(analogInputMin ?? 0.15)
      )
        current = 0;

      if (Math.abs(prevRef.current - current) < (analogInputStep ?? 0.1)) {
        // In that case we do nothing, the value has not changed or, under the thresholt.
        // We do not want to spam the consumer with callback
      } else if (current === 0 && prevRef.current !== 0) {
        // If released
        onChange && onChange(0);
        onDeactivate && onDeactivate();
        prevRef.current = current;
      } else if (prevRef.current === 0) {
        // If activated
        onActivate && onActivate();
        onChange && onChange(current);
        prevRef.current = current;
      } else {
        // Value changed, this concerns only analog inputs
        onChange && onChange(current);
        prevRef.current = current;
      }
    };
    onGamepadUpdate(id ?? 0, handleGamepadUpdate);
    return () => {
      clearGamepadUpdate(id ?? 0, handleGamepadUpdate);
    };
  });
};

export default useGamepadHandler;
