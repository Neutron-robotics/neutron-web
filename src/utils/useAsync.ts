import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

function useAsync<T>(model: T | undefined, callback: () => Promise<T | null>): [T | null, Dispatch<SetStateAction<T | null>>, boolean, Error | null] {
  const [data, setData] = useState<T | null>(model ?? null);
  const [loading, setLoading] = useState<boolean>(model === undefined);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await callback();
      setData(result);
      setError(null);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [callback]);

  useEffect(() => {
    if (!model)
        fetchData();
  }, []);

  return [data, setData, loading, error];
}

export default useAsync;