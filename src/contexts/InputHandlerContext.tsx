import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from "react"

export type InputHandlerType = 'keyboard' | 'gamepad'

type GamepadHandler = Record<number, ((gamepad: Gamepad) => void)[]>

type ContextProps = {
    isKeyboardAvailable: boolean
    isGamepadAvailable: boolean
    current: InputHandlerType
    onGamepadUpdate: (index: number, callback: (gamepad: Gamepad) => void) => void
    clearGamepadUpdate: (index: number, callback: (gamepad: Gamepad) => void) => void
    setInputHandler: (inputhandler: InputHandlerType) => void
}

export const InputHandlerContext = createContext<ContextProps>({
    isKeyboardAvailable: true,
    isGamepadAvailable: false,
    current: 'keyboard',
    onGamepadUpdate: (id: number, callback: (gamepad: Gamepad) => void) => { },
    clearGamepadUpdate: (id: number, callback: (gamepad: Gamepad) => void) => { },
    setInputHandler: (inputhandler: InputHandlerType) => { }
})

export const InputHandlerProvider = ({ children }: { children: ReactNode }) => {
    const [current, setCurrent] = useState<InputHandlerType>('keyboard')
    const [isGamepadAvailable, setIsGamepadAvailable] = useState(false)
    const requestRef = useRef<number>();
    const gamepadHandlersRef = useRef<GamepadHandler>({
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
    })
    const haveEvents = "ongamepadconnected" in window;

    const isKeyboardAvailable = true

    const handleOnChangeInputHandler = (inputhandler: InputHandlerType) => {
        setCurrent(inputhandler)
    }

    const scanGamepad = () => {
        const detectedGamepads: (Gamepad | null)[] = navigator.getGamepads
            ? navigator.getGamepads()
            : (navigator as any).webkitGetGamepads
                ? (navigator as any).webkitGetGamepads()
                : [];
        return detectedGamepads.filter(g => g !== null) as Gamepad[]
    };

    const animate = useCallback(() => {
        if (!haveEvents) {
            const gamepad = scanGamepad();
            gamepad.forEach(gp => {
                gamepadHandlersRef.current[gp.index].forEach(cb => cb(gp))
            })
            // console.log("gamepad is ", gamepad)
        }
        requestRef.current = requestAnimationFrame(animate);
    }, [haveEvents]);

    useEffect(() => {
        if (current !== 'gamepad') return
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animate, current]);

    useEffect(() => {
        const handleOnGamepadConnected = () => {
            const gamepads = scanGamepad()
            if (gamepads.length > 0)
                setIsGamepadAvailable(true)
        }
        handleOnGamepadConnected()
        window.addEventListener("gamepadconnected", handleOnGamepadConnected);
        return () => {
            window.removeEventListener("gamepadconnected", handleOnGamepadConnected);
        };
    });

    const onGamepadUpdate = (id: number, callback: (gamepad: Gamepad) => void) => {
        if (!gamepadHandlersRef.current[id].includes(callback))
            gamepadHandlersRef.current[id].push(callback)
    }

    const clearGamepadUpdate = (id: number, callback: (gamepad: Gamepad) => void) => {
        gamepadHandlersRef.current[id] = gamepadHandlersRef.current[id].filter(e => e !== callback)
    }

    return (
        <InputHandlerContext.Provider
            value={{
                isGamepadAvailable,
                isKeyboardAvailable,
                current,
                setInputHandler: handleOnChangeInputHandler,
                onGamepadUpdate,
                clearGamepadUpdate
            }}
        >
            {children}
        </InputHandlerContext.Provider >
    )

}