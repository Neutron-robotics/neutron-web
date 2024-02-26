import { useCallback, useState } from "react";

type LoadingHook<T> = {
  loading: boolean;
  execute: (asyncFunction: () => Promise<T>) => Promise<T>;
};

function useLoading<T>(): LoadingHook<T> {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, execute };
}

export default useLoading;
