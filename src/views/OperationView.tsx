import { useCallback, useEffect, useRef, useState } from 'react';
import { IOperationCategory, IOperationComponent, IOperationComponentBuilder, IOperationComponentDescriptor, IOperationComponentSpecifics } from '../components/OperationComponents/IOperationComponents';
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
    const [initialized, setInitialized] = useState(false)
    const connection = useConnection(tabId)
    const dispatcher = useTabsDispatch()
    const [operationComponents, setOperationComponents] = useState<IOperationComponent[]>([])
    // const operationComponentsRef = useRef(operationComponents)

    console.log("Actual tab props", actualTab?.components)
    console.log("connection", connection)

    console.log("Operation view state", operationComponents)

    // useEffect(() => {
    //     operationComponentsRef.current = operationComponents
    // }, [operationComponents])

    const handleOnCloseOperationComponent = useCallback((id: string) => {
        console.log(id, "closing from components", operationComponents, " ref")
        setOperationComponents(op => {
            console.log("op is", op, op.filter(item => item.id !== id))
            return op.filter(item => item.id !== id)
        })
        dispatcher({ type: "remove-component", tabId, componentId: id })
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
        const componentSpecific: IOperationComponentSpecifics<unknown> = {
            moduleId: descriptor.moduleId,
            connectionId: tabId,
            onCommitComponentSpecific: <TComponentSpecific,>(specifics: TComponentSpecific) => { },
            specifics: {},
        }
        const layoutComponent = makeOperationComponentLayoutItem(componentBuilder, componentSpecific)
        dispatcher({
            type: "add-component", tabId: tabId, payload:
                { builder: componentBuilder, specifics: componentSpecific }
        })
        setOperationComponents([...operationComponents, layoutComponent])
    }, [dispatcher, handleOnCloseOperationComponent, tabId, operationComponents])

    useEffect(() => {
        if (initialized) {
            console.log("Already initialized")
            return
        }
        if (actualTab) {
            const recoveredOperationComponents = Object.entries(actualTab.components).map(([id, component]) =>
                makeOperationComponentLayoutItem(
                    {
                        ...component.builder,
                        onClose: handleOnCloseOperationComponent,
                    }
                    , component.specifics)
            )
            console.log("Recovered operation components", recoveredOperationComponents)
            setOperationComponents(recoveredOperationComponents)
        }
        else {
            console.log("Actual tab is undefined")
            dispatcher({ type: "update", tabId: tabId, payload: { components: {} } })
            setOperationComponents([])
        }
        setInitialized(true)
    }, [actualTab, dispatcher, initialized, tabId])

    useEffect(() => {
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
                modules={connection?.modules ?? []}
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