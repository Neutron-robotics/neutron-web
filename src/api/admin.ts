import api from "./api";
import { UserModel } from "./models/user.model";

const getUsers = async (): Promise<UserModel[]> => {
    const res = await api.get(`admin/users`)

    if (res.status !== 200) {
        throw new Error("Failed to fetch users");
    }

    return res.data.users
}

const updateUser = async (userId: string, updateSchema: Partial<Omit<UserModel, "id">>) => {
    const res = await api.post(`admin/user/${userId}/update`, updateSchema)

    if (res.status !== 200) {
        throw new Error("Failed to update user");
    }
}

const inviteUser = async (email: string) => {
    const res = await api.post(`admin/inviteUser`, {
        email
    })

    if (res.status !== 200) {
        throw new Error("Failed to invite user");
    }
}

const deleteUser = async (userId: string) => {
    const res = await api.delete(`admin/user`, {
        data: {id: userId}
    })

    if (res.status !== 200) {
        throw new Error("Failed to delete user");
    }
}

export {
    getUsers,
    updateUser,
    inviteUser,
    deleteUser
}