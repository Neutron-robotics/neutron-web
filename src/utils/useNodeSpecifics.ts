import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { Node } from "reactflow";

type SetSpecificsAction<TNodeSpecifics> = (specifics: TNodeSpecifics) => void;

const useNodeSpecifics = <TNodeSpecifics>(
  nodeId: string,
  defaultSpecifics: TNodeSpecifics
): [TNodeSpecifics, SetSpecificsAction<TNodeSpecifics>] => {
  const { setNodes, getNodes } = useReactFlow();
  const nodes = getNodes();
  const node = nodes.find((e) => e.id === nodeId);

  const setSpecifics = useCallback(
    (nodeSpecifics: TNodeSpecifics) => {
      const updatedNodes = nodes.map((e) => {
        if (e.id === nodeId) {
          return {
            ...e,
            data: {
              ...e.data,
              specifics: nodeSpecifics,
            },
          };
        }
        return e;
      });
      setNodes(updatedNodes);
    },
    [nodeId, nodes, setNodes]
  );

  return [
    (node?.data.specifics as TNodeSpecifics) ?? defaultSpecifics,
    setSpecifics,
  ];
};

export default useNodeSpecifics;
