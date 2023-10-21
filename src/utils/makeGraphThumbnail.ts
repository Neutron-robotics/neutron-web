import { toBlob } from "html-to-image";
import { Options } from "html-to-image/lib/types";
import { getRectOfNodes, getTransformForBounds, Node } from "reactflow";

const makeGraphThumbnailFile = async (
    graphTitle: string,
  nodes: Node<any>[]
): Promise<File | undefined> => {
  const nodesBounds = getRectOfNodes(nodes);
  const transform = getTransformForBounds(nodesBounds, 1024, 768, 0.5, 2);
  const doc = document.querySelector<HTMLElement>(".react-flow__viewport");
  if (!doc) return;
  const defaultSettings: Options = {
    backgroundColor: "transparent",
    width: 1024,
    height: 768,
    style: {
      width: "1024",
      height: "768",
      transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
    },
  };

  const blob = await toBlob(doc, defaultSettings);
  if (!blob) return;

  const file = new File([blob], `thumbnail-${graphTitle}.png`, { type: "image/png" });
  return file
};

export default makeGraphThumbnailFile;
