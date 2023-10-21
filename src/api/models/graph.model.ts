export interface INeutronNode {
  width: number;
  height: number;
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  preview: boolean;
  title: string;
  selected: boolean;
  positionAbsolute: {
    x: number;
    y: number;
  };
  dragging: boolean;
  data: any;
  canBeInput?: boolean;
  isInput?: boolean;
}

export interface INeutronEdge {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  id: string;
}

export interface INeutronGraph {
    title: string
    robot: string
    part: string
    createdBy: string
    modifiedBy: string
    edges: INeutronEdge
    nodes: INeutronNode
}

export interface CreateGraphModel {
    title: string,
    robotId: string,
    partId?: string,
    nodes: INeutronNode[]
    edges: INeutronEdge[]
}

export interface UpdateGraphModel {
    title?: string,
    nodes?: INeutronNode[]
    edges?: INeutronEdge[]
}
