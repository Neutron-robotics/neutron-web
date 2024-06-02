import { NeutronGraphType } from "@neutron-robotics/neutron-core";

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
  _id: string;
  title: string;
  type: NeutronGraphType;
  robot: string;
  part?: string;
  imgUrl?: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  updatedAt: string;
  edges: INeutronEdge[];
  nodes: INeutronNode[];
}

export interface INeutronGraphWithOrganization extends INeutronGraph {
  organization: {
    id: string;
    name: string;
    imgUrl: string;
  };
}

export interface INeutronGraphWithRobots extends Omit<INeutronGraph, "robot"> {
  robot: {
    _id: string;
    name: string;
    imgUrl: string;
  };
}

export interface CreateGraphModel {
  title: string;
  robotId: string;
  partId?: string;
  type: NeutronGraphType;
  nodes: INeutronNode[];
  edges: INeutronEdge[];
  imgUrl?: string;
}

export interface UpdateGraphModel {
  title?: string;
  type?: NeutronGraphType;
  nodes?: INeutronNode[];
  edges?: INeutronEdge[];
  imgUrl?: string;
  robotId?: string
  partId?: string 
}
