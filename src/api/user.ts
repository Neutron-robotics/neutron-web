import api from "./api"
import { UserModel } from "./models/user.model"

const getById = async (id: string) => {
    const res = await api.get(`user/${id}`)

    if (res.status !== 200) {
        throw new Error("Could not get user")
    }
    return res.data.user as Partial<UserModel>
}

export {getById}