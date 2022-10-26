import { Paper } from "@mui/material";
import { IRobotModule } from "neutron-core";
import React from "react";
import { IOperationComponentBuilder, IOperationComponentLayoutItem } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";

export interface IOperationBuilderComponentProps {
    onClose: (id: string) => void
    module?: IRobotModule
}

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationBuilderComponentProps): IOperationComponentLayoutItem => {
    const id = `${componentBuilder.name}-${componentBuilder.type}`
    return {
        ...componentBuilder,
        id: id,
        component: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (params: IOperationComponentBuilder, props: IOperationBuilderComponentProps) => {
    const { name, component, settings } = params;
    const { onClose } = props;

    const Component = component

    console.log("make component with props", props)

    return () => (
        <OperationComponent
            name={name}
            onClose={onClose}
            width={settings.defaultWidth}
            height={settings.defaultHeight}
        >
            <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
                <Component {...{ ...params, ...props }} />
            </Paper>
        </OperationComponent>
    )
}