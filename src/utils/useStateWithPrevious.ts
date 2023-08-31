import { useState, useEffect, useRef } from 'react';

function useStateWithPrevious<T>(initialValue: T): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [currentValue, setCurrentValue] = useState<T>(initialValue);
  const previousValueRef = useRef<T>(initialValue);

  useEffect(() => {
    previousValueRef.current = currentValue;
  }, [currentValue]);

  return [
    currentValue,
    previousValueRef.current,
    setCurrentValue
  ];
}

export default useStateWithPrevious;