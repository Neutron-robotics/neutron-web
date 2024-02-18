import { useEffect } from "react"

const useShortPolling = (ms: number, fn: () => void, resCb: (data: any) => void) => {
    useEffect(() => {
        const interval = shortPoll(ms, fn, resCb)

        return () => {
            clearInterval(interval)
        }
    }, [])
}

const shortPoll = (ms: number, fn: () => void, resCb: (data: any) => void) => {
    (fn as any)().then((res: any) => {
        resCb(res)
    })
    return setInterval(async () => {
        const res = await fn()
        resCb(res)
    }, ms)
}

export { shortPoll, useShortPolling }