import { LiteEvent } from "neutron-core"
import { getLatestRobotStatus } from "../api/robot"

const waitForContextToSpawn = async (robotId: string, refreshInterval: number, timeout: number) => {
    return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
            let status
            try {
                status = await getLatestRobotStatus(robotId)
            }
            catch {
                throw new Error("Could not establish connection with the robot")
            }
            if (status.context?.active) {
                clearInterval(timer)
                resolve(status)
            }
            else if (status.context?.active === false && status.context?.pid === -1) {
                clearInterval(timer)
                reject("Context crashed during spawn")
            }
        }, refreshInterval)

        setTimeout(() => {
            clearInterval(timer)
            reject("Timeout waiting for context to spawn")
        }, timeout)
    })
}

const waitForProcessesToSpawn = (robotId: string, processesId: string[], refreshInterval: number, timeout: number): Promise<string>[] => {
    const pendingProcesses = new Set(processesId);
    const processSpawnEvent = new LiteEvent<string>()
    const processTimeoutEvent = new LiteEvent<void>()

    const processesPromises: Promise<string>[] = processesId.map(processId => {
        return new Promise((res, rej) => {
            processSpawnEvent.on(id => {
                if (id === processId)
                    res(id)
            })
            processTimeoutEvent.once(() => rej('Timeout waiting for the process to spawn'))
        })
    })

        const checkProcessesStatus = async () => {
            const status = await getLatestRobotStatus(robotId);

            if (status.processes) {
                for (const process of status.processes) {
                    if (pendingProcesses.has(process.id)) {
                        pendingProcesses.delete(process.id);
                        if (pendingProcesses.size === 0) {
                            clearInterval(timer);
                        }
                        processSpawnEvent.trigger(process.id)
                    }
                }
            }
        };

        const timer = setInterval(checkProcessesStatus, refreshInterval);

        setTimeout(() => {
            processTimeoutEvent.trigger()
            clearInterval(timer);
        }, timeout);

    return processesPromises
}

export {
    waitForContextToSpawn,
    waitForProcessesToSpawn
}