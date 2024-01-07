import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

type UseAsyncOrDefaultProps<T> = {
    model?: T | undefined;
    defaultModel: T;
    isNew: boolean;
};

function useAsyncOrDefault<T>(
    { model, defaultModel, isNew }: UseAsyncOrDefaultProps<T>,
    fetchData: () => Promise<T>
): [T, Dispatch<SetStateAction<T>>, boolean, Error | null] {
    const [data, setData] = useState<T>(model || defaultModel);
    const [loading, setLoading] = useState<boolean>(model === undefined && !isNew);
    const [error, setError] = useState<Error | null>(null);

    const fetchDataAndHandleError = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchData();
            setData(result);
            setError(null);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [fetchData]);

    useEffect(() => {
        if (isNew) {
            // If it's a new item, use the default model
            setData(defaultModel);
        } else if (model === undefined) {
            // If model is null, fetch data
            fetchDataAndHandleError();
        } else {
            // Use the provided model
            setData(model || defaultModel);
        }
    }, []);

    return [data, setData, loading, error];
}

export default useAsyncOrDefault;
