import { NeutronGraphType } from "@hugoperier/neutron-core";
import api from "./api";
import { CreateGraphModel, INeutronGraph, INeutronGraphWithOrganization, INeutronGraphWithRobots, UpdateGraphModel } from "./models/graph.model";

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
    const res = await api.get(`graph/organization/${organizationId}`)
    if (res.status !== 200) {
        throw new Error("could not get organization graphs")
    }
    return res.data.graphs as INeutronGraph[]
}

const getByRobot = async (robotId: string, type?: NeutronGraphType) => {
    const res = await api.get(`graph/robot/${robotId}` + (type ? `?type=${type}` : ""))
    if (res.status !== 200) {
        throw new Error("could not get organization graphs")
    }
    return res.data.graphs as INeutronGraph[]
}

const getAll = async () => {
    const res = await api.get(`graph/all`)
    if (res.status !== 200) {
        throw new Error("could not get graphs")
    }
    return res.data.graphs as INeutronGraph[]
}

const getAllWith = async (robot: boolean, organization: boolean) => {
    const res = await api.get(`graph/all?includeRobot=${robot}&includeOrganization=${organization}`)
    if (res.status !== 200) {
        throw new Error("could not get graphs")
    }
    return res.data.graphs as (INeutronGraphWithOrganization & INeutronGraphWithRobots)[]
}

const update = async (graphId: string, model: UpdateGraphModel): Promise<void> => {
    const res = await api.post(`graph/update/${graphId}`, model)
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
    getByRobot,
    update,
    deleteGraph,
    getAll,
    getAllWith
}