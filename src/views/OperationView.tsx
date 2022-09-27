import OperationSandbox from "../components/OperationSandbox";
import OperationHeader from '../components/Header/OperationHeader';
import { useEffect, useState } from 'react';
import { IOperationCategory, IOperationComponentLayoutItem } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';

const OperationView = () => {
    const [headerCategories, setHeaderCategories] = useState<IOperationCategory[]>([])
    const [operationComponentLayoutItems, setOperationComponentLayoutItems] = useState<IOperationComponentLayoutItem[]>([])

    useEffect(() => {
        setHeaderCategories(operationComponentsConfiguration)
    }, [])

    const mountComponentLayoutItem = (component: IOperationComponentLayoutItem) => {
        if (operationComponentLayoutItems.find(item => item.name === component.name)) {
            return
        }
        setOperationComponentLayoutItems([...operationComponentLayoutItems, component])
    }

    const unmountComponentLayoutItem = (component: IOperationComponentLayoutItem) => {
        setOperationComponentLayoutItems(operationComponentLayoutItems.filter(item => item.name !== component.name))
    }

    return (
        <>
            <OperationHeader
                onConnectClick={() => { }}
                onDisconnectClick={() => { }}
                onHomeClick={() => { }}
                isConnected={false}
                batteryLevel={100}
                wifiLevel={100}
                parts={parts}
            />
            <OperationSandbox
            />
        </>
    )
}

export default OperationView