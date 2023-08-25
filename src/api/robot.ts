import api from "./api"
import { ConnectionContextType, ICreateRobotModel, IUpdateRobotModel } from "./models/robot.model"

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

export {
    create,
    update,
    deleteRobot
}