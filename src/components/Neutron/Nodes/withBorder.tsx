import { NodeProps, useNodes } from "reactflow";
import { VisualNode } from ".";
import { ComponentType } from "react";

export type NodePropsBorderable<T> = NodeProps<T> & { isInput?: boolean }

const withBorder = <T,>(WrappedComponent: ComponentType<NodePropsBorderable<T>>) => {
    return (props: NodeProps<T>) => {
        const { id } = props;
        const node = useNodes().find(e => e.id === id) as VisualNode | undefined
        console.log("Use Node")
        return <WrappedComponent isInput={node?.isInput} {...props} />;
    };
};


export default withBorder
