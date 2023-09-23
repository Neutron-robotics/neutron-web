import { NodeProps } from "reactflow";
import { conditionalNodeTypes } from "./conditional";
import { rosNodeTypes } from "./ros";
import { transformNodeTypes } from "./transform";
import { Node } from "reactflow";
import { componentNodeType } from "./components";

export const nodeTypes: Record<string, (props: any) => JSX.Element> = {
  ...conditionalNodeTypes,
  ...transformNodeTypes,
  ...rosNodeTypes,
  ...componentNodeType,
};

export interface CustomNodeProps<T> extends NodeProps<T> {
  preview: boolean;
}

export interface NodeExtension {
  title?: string;
  isInput?: boolean;
  canBeInput?: boolean;
}

export type VisualNode<
  T = any,
  U extends string | undefined = string | undefined
> = Node<T, U> & NodeExtension;
