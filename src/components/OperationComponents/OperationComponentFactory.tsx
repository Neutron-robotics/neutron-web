import { Paper } from "@mui/material";
import React from "react";
import { IOperationComponent, IOperationComponentBuilder, IOperationComponentSpecifics } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationComponentSpecifics): IOperationComponent => {
    return {
        ...componentBuilder,
        operationComponent: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (builder: IOperationComponentBuilder, props: IOperationComponentSpecifics) => {
    const { name, settings, onClose, component, id, tabId } = builder;

    console.log("make component with props", props)

    const OperationComponentContent = component

    return () => (
        <OperationComponent
            id={id}
            tabId={tabId}
            name={name}
            onClose={onClose}
            width={settings.defaultWidth}
            height={settings.defaultHeight}
            defaultPosition={settings.defaultPosition}
        >
            <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
                <OperationComponentContent {...props} />
            </Paper>
        </OperationComponent>
    )
}