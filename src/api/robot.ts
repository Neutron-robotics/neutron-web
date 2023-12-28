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

const getRobot = async (robotId: string): Promise<IRobot> => {
    const res = await api.get(`robot/${robotId}`)

    if (res.status !== 200) {
        throw new Error("Could not delete the robot")
    }
    return res.data.robot as IRobot
}

const getLatestRobotStatus = async (robotId: string): Promise<IRobotStatus> => {
    const res = await api.get(`robot/status/${robotId}`)

    if (res.status !== 200) {
        throw new Error("Could not delete the robot")
    }
    return res.data.status as IRobotStatus
}

const getMyRobots = async (includeStatus: boolean): Promise<IRobotWithStatus[]> => {
    const res = await api.get(`user/me/robots${includeStatus ? '?includeStatus=true' : ''}`)

    if (res.status !== 200) {
        throw new Error("Could not delete the robot")
    }
    return res.data.robots as IRobotWithStatus[]
}


export {
    create,
    getRobot,
    update,
    deleteRobot,
    getLatestRobotStatus,
    getMyRobots
}