import OperationalConnectorGraph from "../../../utils/ConnectorGraph"
import componentData from '../../../data/components.json'
import { IOperationCategory, IOperationCategoryFiltered, IOperationComponentDescriptor } from "./types"

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