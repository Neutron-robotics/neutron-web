import React from "react";
import { IOperationCategory, IOperationComponent, IOperationComponentBuilder, IOperationComponentSpecifics } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";
import componentData from '../../data/components.json'

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationComponentSpecifics<unknown>): IOperationComponent => {
    return {
        ...componentBuilder,
        operationComponent: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (builder: IOperationComponentBuilder, props: IOperationComponentSpecifics<unknown>) => {
    const { name, settings, onClose, component, id, tabId } = builder;

    const OperationComponentContent = component

    return () => (
        <OperationComponent
            id={id}
            tabId={tabId}
            name={name}
            onClose={onClose}
            settings={settings}
            defaultPosition={settings.defaultPosition}
            content={{
                Component: OperationComponentContent,
                ...props
            }}
        />
    )
}

export const loadOperationComponents = (): IOperationCategory[] => {
    const categories = Object.entries(componentData).map(([key, value]) => {
        const category: IOperationCategory = {
            name: key,
            icon: value.icon,
            components: value.components
        }
        return category
    })

    return categories
}