import TestNode from "./TestNode";
import { conditionalNodeTypes } from "./conditional";
import { rosNodeTypes } from "./ros";
import { transformNodeTypes } from "./transform";

export const nodeTypes: Record<string, (props: any) => JSX.Element> = {
    ...conditionalNodeTypes,
    ...transformNodeTypes,
    ...rosNodeTypes,
    customNode: TestNode
}