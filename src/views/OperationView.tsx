import OperationSandbox from "../components/OperationSandbox";
import OperationHeader from '../components/Header/OperationHeader';
import { useEffect, useState } from 'react';
import { IOperationCategory, IOperationComponentBuilder, IOperationComponentLayoutItem } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";

const OperationView = () => {
    const [headerCategories, setHeaderCategories] = useState<IOperationCategory[]>([])
    const [operationComponentLayoutItems, setOperationComponentLayoutItems] = useState<IOperationComponentLayoutItem[]>([])


    useEffect(() => {
        setHeaderCategories(operationComponentsConfiguration)
    }, [])

    const mountComponent = (component: IOperationComponentBuilder) => {
        const layoutComponent = makeOperationComponentLayoutItem(component, {
            onClose: unmountComponentLayoutItem,
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