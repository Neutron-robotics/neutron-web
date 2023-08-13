import api from "./api"
import { CreateOrganizationModel, OrganizationModel } from "./models/organization.model"
import { IRobot } from "./models/robot.model"
import { UserDTO } from "./models/user.model"

const create = async (model: CreateOrganizationModel) => {
    const res = await api.post(`organization/create`, model)

    if (res.status !== 200) {
        throw new Error("Email or password incorrect")
    }
}

const me = async () => {
    const res = await api.get(`organization/me`)

    if (res.status !== 200) {
        throw new Error("Could not get self organizations")
    }
    return res.data.organizations as OrganizationModel[]
}

const getMember = async (organizationName: string, filter: {userId?: string, email?: string}) => {
    const res  = await api.get(`organization/${organizationName}/getMember`, {
        params: filter
    })

    if (res.status !== 200) {
        throw new Error("Could not get self organizations")
    }
    return res.data.user as UserDTO
}

const update = async (name: string, model: Partial<CreateOrganizationModel>) => {
    const res = await api.post(`organization/${name}/update`, model)

    if (res.status !== 200) {
        throw new Error("Failed to update organization")
    }
}

const promote = async (name: string, role: string, userEmail: string) => {
    const res = await api.post(`organization/${name}/promote`, {
        role,
        user: userEmail
    })

    if (res.status !== 200) {
        throw new Error("Failed to promote the user")
    }
}

const demote = async (name: string, userEmail: string) => {
    const res = await api.post(`organization/${name}/demote`, {
        user: userEmail
    })

    if (res.status !== 200) {
        throw new Error("Failed to demote the user")
    }
}

const deleteOrganization = async (name: string) => {
    const res = await api.delete(`organization/${name}/delete`)

    if (res.status !== 200) {
        throw new Error("Failed to delete the organization")
    }
}

const getOrganizationRobots = async (name: string) => {
    const res = await api.get(`organization/${name}/robots`)

    if (res.status !== 200) {
        throw new Error("Failed to delete the organization")
    }
    return res.data.robots as IRobot[]
}

export {
    create,
    me,
    update,
    promote,
    demote,
    getMember,
    deleteOrganization,
    getOrganizationRobots
}