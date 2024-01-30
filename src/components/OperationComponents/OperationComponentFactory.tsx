import React from "react";
import { IOperationCategory, IOperationCategoryFiltered, IOperationComponent, IOperationComponentBuilder, IOperationComponentDescriptor, IOperationComponentDescriptorWithParts, IOperationComponentSpecifics } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";
import componentData from '../../data/components.json'
import OperationalConnectorGraph from "../../utils/ConnectorGraph";

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


export const loadOperationComponentsWithPartDependancies = (partsId: string[], connectors: OperationalConnectorGraph[]): IOperationCategoryFiltered[] => {
    const operationCategories: IOperationCategory[] = loadOperationComponents()

    console.log(partsId, connectors)

    const operationCategoriesFiltered: IOperationCategoryFiltered[] = operationCategories
        .map(category => {
            const categoryFiltered: IOperationCategoryFiltered = {
                ...category,
                components: category.components.map(component => {
                    return {
                        name: component.name,
                        icon: component.icon,
                        component: component.component,
                        settings: component.settings,
                        parts: loadComponentParts(component, connectors, partsId)
                    }
                })
            }
            return categoryFiltered
        }).filter(category => category.components.find(e => e.parts.length > 0) !== undefined)

    return operationCategoriesFiltered
}

const loadComponentParts = (component: IOperationComponentDescriptor, connectors: OperationalConnectorGraph[], partsId: string[]): string[] => {
    return partsId.filter(partId => {
        const connectorsForThisPart = connectors.filter(connector => connector.partId === partId)
        const areDependancyResolved = component.controllerDependancies.every(dependancy => {
            const isDependancyResolved = connectorsForThisPart.find(connector => connector.getControllerNodes().find(e => e.type === dependancy)) !== undefined
            return isDependancyResolved
        })
        return areDependancyResolved
    })
}