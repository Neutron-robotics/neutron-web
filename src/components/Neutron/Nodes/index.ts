import { NodeProps } from "reactflow";
import { Node } from "reactflow";
import FlowNode from "./FlowNode";
import { INeutronNode } from "../../../api/models/graph.model";
import _ from "lodash";

export const nodeType: Record<string, (props: any) => JSX.Element> = {
  flowNode: FlowNode,
};

export interface CustomNodeProps<T> extends NodeProps<T> {
  // preview: boolean;
}

export interface NodeExtension {
  title?: string;
}

export type VisualNode<
  T = any,
  U extends string | undefined = string | undefined
> = Node<T, U> & NodeExtension;

export const areNodeEqual = (
  nodes1: INeutronNode[] | Node[],
  nodes2: INeutronNode[] | Node[]
): boolean => {
  const propertyIsolator = (e: INeutronNode | Node) => ({
    data: e.data,
    id: e.id,
    type: e.type,
    position: e.position,
  });

  const first = nodes1.map(propertyIsolator);
  const second = nodes2.map(propertyIsolator);
  return _.isEqual(first, second);
};
