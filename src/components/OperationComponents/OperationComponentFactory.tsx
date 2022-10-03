import { Paper } from "@mui/material";
import React from "react";
import { IOperationComponentBuilder, IOperationComponentLayoutItem } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationBuilderComponentProps): IOperationComponentLayoutItem => {
    const id = `${componentBuilder.name}-${componentBuilder.type}`
    return {
        ...componentBuilder,
        id: id,
        component: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (params: IOperationComponentBuilder, props: IOperationBuilderComponentProps) => {
    const { name, component } = params;
    const { onClose } = props;

    const Component = component

    return () => (
        <OperationComponent
            name={name}
            onClose={onClose}
            width={100}
            height={100}
        >
            <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
                <Component {...params} />
            </Paper>
        </OperationComponent>
    )
}

export interface IOperationBuilderComponentProps {
    onClose: (id: string) => void
}