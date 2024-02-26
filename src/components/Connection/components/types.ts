 type OperationComponentType = "passive" | "active";

 export interface IOperationComponentSettings {
  defaultSize?: ILayoutSize;
  defaultPosition?: ILayoutCoordinates;
  resizable?: boolean;
  conserveSizeRatio?: boolean;
  minSize?: ILayoutSize;
  maxSize?: ILayoutSize;
}

 interface ILayoutCoordinates {
  x: number;
  y: number;
}

 interface ILayoutSize {
  width: number;
  height: number;
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


 export interface IOperationCategoryFiltered {
  name: string;
  icon: string;
  components: IOperationComponentDescriptorWithParts[];
}

 export interface IOperationComponentDescriptorWithParts {
  name: string;
  icon: string;
  component: string
  settings?: IOperationComponentSettings;
  parts: string[]
}