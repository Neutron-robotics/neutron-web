import { useCallback, useEffect, useState } from 'react';
import { IOperationComponent, IOperationComponentBuilder, IOperationComponentDescriptor } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";
import IViewProps from "./IView";
import OperationHeader from "../components/Header/OperationHeader";
import { makeStyles } from "@mui/styles";
import { useTab, useTabsDispatch } from "../contexts/TabContext";
import { v4 as uuid } from 'uuid';

const useStyles = makeStyles(() => ({
    root: {
        backgroundImage: "radial-gradient(black 2px, transparent 0)",
        backgroundPosition: "0px -36px",
        backgroundSize: "40px 40px",
        height: "100vh",
        position: "relative",
    }
}))

export interface IOperationViewProps extends IViewProps {
    id: string
}

const OperationView = (props: IOperationViewProps) => {
    const { setHeaderBody, id } = props
    const classes = useStyles()
    const actualTab = useTab(id)
    const dispatcher = useTabsDispatch()
    const [operationComponents, setOperationComponents] = useState<IOperationComponent[]>([])

    console.log("Actual tab props", actualTab?.components)

    const handleOnCloseOperationComponent = useCallback((id: string) => {
        setOperationComponents(operationComponents.filter(item => item.id !== id))
    }, [operationComponents])

    const handleOnAddOperationComponent = useCallback((descriptor: IOperationComponentDescriptor) => {
        const componentBuilder: IOperationComponentBuilder = {
            id: uuid(),
            tabId: id,
            name: descriptor.name,
            type: descriptor.type,
            settings: descriptor.settings,
            component: descriptor.component,
            onClose: handleOnCloseOperationComponent,
        }
        const layoutComponent = makeOperationComponentLayoutItem(componentBuilder, {
            // todo: add module Id
        })
        dispatcher({ type: "add-component", tabId: id, payload: { builder: componentBuilder, specifics: {} } })
        setOperationComponents([...operationComponents, layoutComponent])
    }, [dispatcher, handleOnCloseOperationComponent, id, operationComponents])

    useEffect(() => {
        if (actualTab) {
            const recoveredOperationComponents = Object.entries(actualTab.components).map(([id, component]) =>
                makeOperationComponentLayoutItem(component.builder, component.specifics)
            )
            console.log("Recovered operation components", recoveredOperationComponents)
            setOperationComponents(recoveredOperationComponents)
        }
        else {
            console.log("Actual tab is undefined")
            dispatcher({ type: "update", tabId: id, payload: { components: {} } })
            setOperationComponents([])
        }
    }, [actualTab, dispatcher, id])

    useEffect(() => {
        setHeaderBody(
            <OperationHeader
                onConnectClick={() => { }}
                onDisconnectClick={() => { }}
                mountComponent={handleOnAddOperationComponent}
                isConnected={false}
                batteryLevel={100}
                wifiLevel={100}
                operationCategories={operationComponentsConfiguration}
            />
        )
    }, [handleOnAddOperationComponent, setHeaderBody])

    return (
        <>
            <div className={classes.root}>
                {operationComponents.map((e: IOperationComponent) => {
                    const OperationComponent = e.operationComponent
                    return (
                        <OperationComponent
                            key={e.id}
                        />
                    )
                })}
            </div>
        </>
    )
}

export default OperationView