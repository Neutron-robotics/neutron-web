import { useState, useEffect } from "react";

export default function useCachedState<T>(
  stateName: string,
  initialState: T = undefined as T
): [T, (newState: T) => void] {
  const [cachedState, setCachedState] = useState(initialState);

  useEffect(() => {
    const cachedStateFromStore = localStorage.getItem(stateName);
    if (cachedStateFromStore) {
      setCachedState(JSON.parse(cachedStateFromStore));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setState = (newState: T) => {
    setCachedState(newState);
    localStorage.setItem(stateName, JSON.stringify(newState));
  };

  return [cachedState, setState];
}