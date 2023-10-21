import api from "./api";
import { CreateGraphModel, INeutronGraph, UpdateGraphModel } from "./models/graph.model";

const create = async (model: CreateGraphModel): Promise<string> => {
    const res = await api.post(`graph/create`, model)
    if (res.status !== 200) {
        throw new Error("Impossible to create a graph")
    }
    return res.data.id
}

const me = async () => {
    const res = await api.get(`graph/me`)

    if (res.status !== 200) {
        throw new Error("Could not get self graphs")
    }
    return res.data.graphs as INeutronGraph[]
}

const getByOrganization = async (organizationId: string) => {
    const res = await api.post(`graph/organization/${organizationId}`, create)
    if (res.status !== 200) {
        throw new Error("could not get organization graphs")
    }
    return res.data.graphs as INeutronGraph[]
}

const update = async (model: UpdateGraphModel): Promise<void> => {
    const res = await api.post(`graph/update`, model)
    if (res.status !== 200) {
        throw new Error("Impossible to update a graph")
    }
}

const deleteGraph = async (graphId: string) => {
    const res = await api.delete(`graph/${graphId}`)
    if (res.status !== 200) {
        throw new Error("Impossible to delete a graph")
    }
}

export {
    create,
    me,
    getByOrganization,
    update,
    deleteGraph
}