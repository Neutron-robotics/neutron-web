import { Paper } from "@mui/material";
import React from "react";
import { IRobotModule } from "../../network/IRobot";
import { operationComponentsConfiguration } from "./components";
import { IOperationComponentBuilder, IOperationComponentLayoutItem } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";


// export const makeOperationComponentsFromModules = (modules: IRobotModule[]): IOperationComponentLayoutItem[] => {
//    return modules.reduce<IOperationComponentLayoutItem[]>((acc, cur) => {
//         const components = makeOperationComponentsFromModule(cur);
//         acc.push(...components);
//         return acc;
//     }, [])
// }

// export const makeOperationComponentsFromModule = (module: IRobotModule): IOperationComponentLayoutItem[] => {
//     const components = []
//     for (const componentBuilder of operationComponentsConfiguration) {
//         if (componentBuilder.type === module.type) {
//             components.push({
//                 ...componentBuilder,
//                 id: `${module.id}-${componentBuilder.name}-${componentBuilder.type}`,
//                 component: makeOperationComponent(componentBuilder)
//             })
//         }
//     }
//     return components
// }

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationBuilderComponentProps): IOperationComponentLayoutItem => {
    const id = `${componentBuilder.name}-${componentBuilder.type}`
    return {
        ...componentBuilder,
        id: id,
        component: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (params: IOperationComponentBuilder, props: IOperationBuilderComponentProps) => {
    const { name, settings, component } = params;
    const { onClose } = props;
    const { defaultWidth, defaultHeight } = settings;

    const Component = component

    return () => (
        <OperationComponent
            name={name}
            onClose={onClose}
            width={defaultWidth}
            height={defaultHeight}
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