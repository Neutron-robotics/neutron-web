import { NodeProps } from "reactflow";
import { Node } from "reactflow";
import FlowNode from "./FlowNode";

export const newNodeType: Record<string, (props: any) => JSX.Element> = {
  'flowNode': FlowNode
}

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