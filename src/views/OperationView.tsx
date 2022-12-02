import { useCallback, useEffect, useRef, useState } from 'react';
import { IOperationCategory, IOperationComponent, IOperationComponentBuilder, IOperationComponentDescriptor } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";
import IViewProps from "./IView";
import OperationHeader from "../components/Header/OperationHeader";
import { makeStyles } from "@mui/styles";
import { useTab, useTabsDispatch } from "../contexts/TabContext";
import { v4 as uuid } from 'uuid';
import { useConnection } from '../contexts/MultiConnectionProvider';
import { makeOperationBar } from '../utils/makeOperationBar';

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
    tabId: string
}

const OperationView = (props: IOperationViewProps) => {
    const { setHeaderBody, tabId } = props
    const classes = useStyles()
    const actualTab = useTab(tabId)
    const connection = useConnection(tabId)
    const dispatcher = useTabsDispatch()
    const [operationComponents, setOperationComponents] = useState<IOperationComponent[]>([])
    const operationComponentsRef = useRef(operationComponents)

    console.log("Actual tab props", actualTab?.components)
    console.log("connection", connection)

    useEffect(() => {
        operationComponentsRef.current = operationComponents
    }, [operationComponents])

    const handleOnCloseOperationComponent = useCallback((id: string) => {
        console.log("Operation components", operationComponents)
        console.log("Operation components ref", operationComponentsRef)
        dispatcher({ type: "remove-component", tabId, componentId: id })
        setOperationComponents(operationComponents.filter(item => item.id !== id))
    }, [dispatcher, operationComponents, tabId])

    const handleOnAddOperationComponent = useCallback((descriptor: IOperationComponentDescriptor) => {
        const componentBuilder: IOperationComponentBuilder = {
            id: uuid(),
            tabId: tabId,
            name: descriptor.name,
            type: descriptor.type,
            settings: descriptor.settings,
            component: descriptor.component,
            onClose: handleOnCloseOperationComponent,
        }
        const layoutComponent = makeOperationComponentLayoutItem(componentBuilder, {
            // todo: add module Id
        })
        dispatcher({ type: "add-component", tabId: tabId, payload: { builder: componentBuilder, specifics: {} } })
        setOperationComponents([...operationComponents, layoutComponent])
    }, [dispatcher, handleOnCloseOperationComponent, tabId, operationComponents])

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
            dispatcher({ type: "update", tabId: tabId, payload: { components: {} } })
            setOperationComponents([])
        }
    }, [actualTab, dispatcher, tabId])

    useEffect(() => {
        // if (!connection) {
        //     console.log("No connection")
        //     return
        // }
        // console.log("connection")
        const operationCategoryFiltered: IOperationCategory[] = makeOperationBar(operationComponentsConfiguration, connection?.modules ?? [])
        setHeaderBody(
            <OperationHeader
                onConnectClick={() => { }}
                onDisconnectClick={() => { }}
                mountComponent={handleOnAddOperationComponent}
                isConnected={false}
                batteryLevel={100}
                wifiLevel={100}
                operationCategories={operationCategoryFiltered}
            />
        )
    }, [handleOnAddOperationComponent, connection, setHeaderBody])

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