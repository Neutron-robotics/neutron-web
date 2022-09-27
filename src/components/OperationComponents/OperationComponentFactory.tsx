import { Paper } from "@mui/material";
import React from "react";
import { IRobotModule } from "../../network/IRobot";
import { componentsBuilder } from "./components";
import { IOperationComponentBuilder, OperationComponentLayoutItem } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";


export const makeOperationComponentsFromModules = (modules: IRobotModule[]): OperationComponentLayoutItem[] => {
   return modules.reduce<OperationComponentLayoutItem[]>((acc, cur) => {
        const components = makeOperationComponentsFromModule(cur);
        acc.push(...components);
        return acc;
    }, [])
}

export const makeOperationComponentsFromModule = (module: IRobotModule): OperationComponentLayoutItem[] => {
    const components = []
    for (const componentBuilder of componentsBuilder) {
        if (componentBuilder.partType === module.type) {
            components.push({
                ...componentBuilder,
                id: `${module.id}-${componentBuilder.name}-${componentBuilder.type}`,
                component: makeOperationComponent(componentBuilder)
            })
        }
    }
    return components
}

export const makeOperationComponent = (params: IOperationComponentBuilder) => {
    const { name, settings, component } = params;
    const { defaultWidth, defaultHeight } = settings;

    const Component = component

    return () => (
        <OperationComponent
            name={name}
            onClose={() => { }}
            width={defaultWidth}
            height={defaultHeight}
        >
            <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
                <Component {...params} />
            </Paper>
        </OperationComponent>
    )
}