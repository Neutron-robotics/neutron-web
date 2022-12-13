export type OperationComponentType = "passive" | "active";

export interface IOperationComponentSettings {
  defaultWidth: number;
  defaultHeight: number;
  defaultPosition?: ILayoutCoordinates;
}

export interface IOperationComponentDescriptor {
  name: string;
  type: OperationComponentType;
  partType: string;
  component: (props: any) => JSX.Element;
  icon: JSX.Element;
  settings: IOperationComponentSettings;
  moduleId?: string;
}

export interface IOperationComponentBuilder {
  id: string;
  tabId: string;
  name: string;
  type: OperationComponentType;
  settings: IOperationComponentSettings;

  component: (props: any) => JSX.Element;
  onClose: (id: string) => void;
}

export interface IOperationComponentSpecifics {
  connectionId: string;
  moduleId?: string;
}

export interface ILayoutCoordinates {
  x: number;
  y: number;
}

export interface IOperationComponent {
  id: string;
  name: string;
  type: OperationComponentType;
  operationComponent: (props: any) => JSX.Element;
}

export interface IOperationCategory {
  name: string;
  type: string;
  icon: JSX.Element;
  components: IOperationComponentDescriptor[];
}
