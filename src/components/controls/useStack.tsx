import { useState } from 'react';

type UseStackReturnType<T> = {
    stack: T[];
    push: (value: T) => void;
    pop: () => void;
    peek: () => T | undefined;
    clear: () => void;
};

function useStack<T>(initialValue: T): UseStackReturnType<T> {
    const [stack, setStack] = useState<T[]>([initialValue]);

    const push = (value: T) => {
        setStack(prevStack => [...prevStack, value]);
    };

    const pop = () => {
        if (stack.length > 1) {
            setStack(prevStack => prevStack.slice(0, -1));
        }
    };

    const peek = () => {
        return stack[stack.length - 1];
    };

    const clear = () => {
        setStack([initialValue]);
    };

    return {
        stack,
        push,
        pop,
        peek,
        clear,
    };
}

export default useStack;