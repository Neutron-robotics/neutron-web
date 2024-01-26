export type OperationComponentType = "passive" | "active";

export interface IOperationComponentSettings {
  defaultSize?: ILayoutSize;
  defaultPosition?: ILayoutCoordinates;
  resizable?: boolean;
  conserveSizeRatio?: boolean;
  minSize?: ILayoutSize;
  maxSize?: ILayoutSize;
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

export interface IOperationComponentSpecifics<TComponentSpecific> {
  connectionId: string;
  moduleId?: string;
  specifics: TComponentSpecific;
  onCommitComponentSpecific: <TComponentSpecific>(
    specifics: TComponentSpecific
  ) => void;
}

export interface ILayoutCoordinates {
  x: number;
  y: number;
}

export interface ILayoutSize {
  width: number;
  height: number;
}

export interface IOperationComponent {
  id: string;
  name: string;
  type: OperationComponentType;
  operationComponent: (props: any) => JSX.Element;
}

export interface IOperationCategory {
  name: string;
  icon: string;
  components: IOperationComponentDescriptor[];
}

export interface IOperationComponentDescriptor {
  name: string;
  icon: string;
  component: string
  controllerDependancies: string[]
  settings?: IOperationComponentSettings;
}