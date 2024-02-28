import api from "./api"
import { CreateRobotPartModel } from "./models/part.model"

const create = async (robotId: string, createModel: CreateRobotPartModel): Promise<string> => {
    const res = await api.post(`robot/${robotId}/part/create`, createModel)

    if (res.status !== 200) {
        throw new Error("Could not update the robot")
    }
    return res.data.id
}

const update = async (robotId: string, partId: string, updateModel: Partial<CreateRobotPartModel>) => {
    const res = await api.post(`robot/${robotId}/part/${partId}/update`, updateModel)

    if (res.status !== 200) {
        throw new Error("Could not update the robot")
    }
}

const deleteRobotPart = async (robotId: string, partId: string) => {
    const res = await api.delete(`robot/${robotId}/part/${partId}`)

    if (res.status !== 200) {
        throw new Error("Could not update the robot")
    }
}

export {
    create,
    update,
    deleteRobotPart
}