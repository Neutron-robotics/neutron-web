export type OperationComponentType = 'passive' | 'active'

export interface IOperationComponentSettings {
    defaultWidth: number
    defaultHeight: number
}

export interface IOperationComponentBuilder {
    name: string;
    type: OperationComponentType;
    partType: string;
    component: (props: any) => JSX.Element;
    icon: JSX.Element;
    settings: IOperationComponentSettings;
}

export interface IOperationComponentLayoutItem extends IOperationComponentBuilder {
    id: string;
}

export interface IOperationCategory {
    name: string;
    type: string;
    icon: JSX.Element;
    components: IOperationComponentBuilder[];
}