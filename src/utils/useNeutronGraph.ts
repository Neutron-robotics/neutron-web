import {
  ConnectorGraph,
  FlowGraph,
  NeutronEdgeDB,
  NeutronGraphType,
  NeutronNodeDB,
  NodeMessage,
} from "neutron-core";
import { useState } from "react";
import { sleep } from "./time";

export type NeutronGraphStatus =
  | "unloaded"
  | "compiling"
  | "stopped"
  | "ready"
  | "running";

const useNeutronGraph = (initialTimeout: number = 1000) => {
  const [graph, setGraph] = useState<ConnectorGraph | FlowGraph | undefined>();
  const [status, setStatus] = useState<NeutronGraphStatus>("unloaded");

  const makeNeutronGraph = async (
    type: NeutronGraphType,
    nodes: NeutronNodeDB[],
    edges: NeutronEdgeDB[]
  ) => {
    let graph;

    setStatus("compiling");

    await sleep(initialTimeout);

    if (type === "Connector") {
      graph = new ConnectorGraph(nodes, edges);
    } else if (type === "Flow") {
      graph = new FlowGraph(nodes, edges);
    }

    if (!graph) throw new Error("Could not create the neutron graph");

    setGraph(graph);
    setStatus("ready");
    return graph;
  };

  const runNode = async (id: string, message?: NodeMessage) => {
    if (!graph) throw new Error("No graph loaded");

    const node = graph.getNodeById(id);
    if (!node) throw new Error(`No node found with id ${id}`);

    setStatus("running");
    await graph.run(node, message);
    setStatus("ready");
  };

  const unload = () => {
    setGraph(undefined);
    setStatus("unloaded");
  };

  return {
    graphStatus: status,
    makeNeutronGraph,
    runNode,
    unloadGraph: unload,
  };
};

export default useNeutronGraph;
