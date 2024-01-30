import { ConnectorGraph, NeutronEdgeDB, NeutronNodeDB } from "neutron-core";

export default class OperationalConnectorGraph extends ConnectorGraph {
    public partId: string
    public robotId: string

    constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[], robotId: string, partId: string) {
        super(nodes, edges)
        this.partId = partId
        this.robotId = robotId
    }
}