import { IOperationComponent, IOperationComponentBuilder, IOperationComponentSpecifics } from "./IOperationComponents";
import OperationComponent from "./OperationComponent";

export const makeOperationComponentLayoutItem = (componentBuilder: IOperationComponentBuilder, props: IOperationComponentSpecifics<unknown>): IOperationComponent => {
    return {
        ...componentBuilder,
        operationComponent: makeOperationComponent(componentBuilder, props)
    }
}

export const makeOperationComponent = (builder: IOperationComponentBuilder, props: IOperationComponentSpecifics<unknown>) => {
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
            content={{
                Component: OperationComponentContent,
                ...props
            }}
        />
    )
}

// <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
            //     <OperationComponentContent {...props} />
            // </Paper>