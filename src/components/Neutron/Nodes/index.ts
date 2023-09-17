import { NodeProps } from "reactflow";
import { conditionalNodeTypes } from "./conditional";
import { rosNodeTypes } from "./ros";
import { transformNodeTypes } from "./transform";

export const nodeTypes: Record<string, (props: any) => JSX.Element> = {
  ...conditionalNodeTypes,
  ...transformNodeTypes,
  ...rosNodeTypes,
};

export interface CustomNodeProps<T> extends NodeProps<T> {
  preview: boolean;
  title: string;
}