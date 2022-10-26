import OperationSandbox from "../components/OperationSandbox";
import OperationHeader from '../components/Header/OperationHeader';
import { useContext, useEffect, useState } from 'react';
import { IOperationCategory, IOperationComponentBuilder, IOperationComponentLayoutItem } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";
import { IRobotModule, makeModule } from "neutron-core";
import { ConnectionContext } from "../contexts/ConnectionProvider";

const OperationView = () => {
    const [headerCategories, setHeaderCategories] = useState<IOperationCategory[]>([])
    const [operationComponentLayoutItems, setOperationComponentLayoutItems] = useState<IOperationComponentLayoutItem[]>([])
    const [modules, setModules] = useState<IRobotModule[]>([])
    const { context } = useContext(ConnectionContext)

    useEffect(() => {
        setHeaderCategories(operationComponentsConfiguration)
    }, [])

    const mountComponent = (component: IOperationComponentBuilder) => {
        if (!context) {
            console.log("No context")
            return
        }
        let module = modules.find(m => m.type === component.type)
        if (!module && component.needModule) {
            module = makeModule(component.partType, context, {
                id: "",
                name: component.name,
                type: component.partType,
                module: component.settings,
                framePackage: component.framePackage,
            })
            if (!module) {
                console.log("No module")
                return
            }
            setModules([...modules, module])
        }
        const layoutComponent = makeOperationComponentLayoutItem(component, {
            onClose: unmountComponentLayoutItem,
            module: module
        })
        console.log("make layout")
        setOperationComponentLayoutItems([...operationComponentLayoutItems, layoutComponent])
    }

const unmountComponentLayoutItem = (name: string) => {
    setOperationComponentLayoutItems(operationComponentLayoutItems.filter(item => item.id !== name))
}

return (
    <>
        <OperationHeader
            onConnectClick={() => { }}
            onDisconnectClick={() => { }}
            onHomeClick={() => { }}
            mountComponent={mountComponent}
            isConnected={false}
            batteryLevel={100}
            wifiLevel={100}
            parts={headerCategories}
        />
        <OperationSandbox
            onComponentClose={unmountComponentLayoutItem}
            components={operationComponentLayoutItems}
        />
    </>
)
}

export default OperationView