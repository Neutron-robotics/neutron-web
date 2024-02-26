import api from "./api"
import { ConnectionContextType, ICreateRobotModel, IRobot, IRobotStatus, IRobotWithStatus, IUpdateRobotModel } from "./models/robot.model"

const create = async (organizationId: string, model: ICreateRobotModel) => {
    const res = await api.post(`robot/create`, {
        ...model,
         connectionContextType: ConnectionContextType.Ros2,
         organizationId
        })

    if (res.status !== 200) {
        throw new Error("Could not create a robot")
    }
}

const update = async (robotId: string, model: IUpdateRobotModel) => {
    const res = await api.post(`robot/update/${robotId}`, model)

    if (res.status !== 200) {
        throw new Error("Could not update the robot")
    }
}

const deleteRobot = async (robotId: string) => {
    const res = await api.delete(`robot/${robotId}`)

    if (res.status !== 200) {
        throw new Error("Could not delete the robot")
    }
}

const getRobot = async (robotId: string, includeStatus: boolean = false): Promise<IRobot | IRobotWithStatus> => {
    const res = await api.get(`robot/${robotId}${includeStatus ? '?includeStatus=true' : ''}`)

    if (res.status !== 200) {
        throw new Error("Could not get the robot")
    }
    return res.data.robot as IRobot | IRobotWithStatus
}

const getLatestRobotStatus = async (robotId: string): Promise<IRobotStatus> => {
    const res = await api.get(`robot/status/${robotId}`)

    if (res.status !== 200) {
        throw new Error("Could not get the latest robot status")
    }
    return res.data.status as IRobotStatus
}

const getMyRobots = async (includeStatus: boolean): Promise<IRobotWithStatus[]> => {
    const res = await api.get(`user/me/robots${includeStatus ? '?includeStatus=true' : ''}`)

    if (res.status !== 200) {
        throw new Error("Could not get my robots")
    }
    return res.data.robots as IRobotWithStatus[]
}

const start = async (robotId: string, partsId?: string[]) => {
    const res = await api.post(`robot/start/${robotId}`, { partsId })

    if (res.status !== 200) {
        throw new Error("Could not start the robot")
    }
}

const stop = async (robotId: string) => {
    const res = await api.post(`robot/stop/${robotId}`)

    if (res.status !== 200) {
        throw new Error("Could not stop the robot")
    }
}


export {
    create,
    getRobot,
    update,
    start,
    stop,
    deleteRobot,
    getLatestRobotStatus,
    getMyRobots
}