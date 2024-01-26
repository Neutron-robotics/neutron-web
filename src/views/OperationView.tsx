import { useCallback, useEffect, useState } from 'react';
import { IOperationCategory, IOperationComponent, IOperationComponentBuilder, IOperationComponentDescriptor, IOperationComponentSpecifics } from '../components/OperationComponents/IOperationComponents';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";
import IViewProps from "./IView";
import OperationHeader from "../components/Header/OperationHeader";
import { makeStyles } from "@mui/styles";
import { useTab, useTabsDispatch } from "../contexts/TabContext";
import { v4 as uuid } from 'uuid';
import { useConnection } from '../contexts/MultiConnectionProvider';
import { makeOperationBar } from '../utils/makeOperationBar';
import React from 'react';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    root: {
        backgroundImage: "radial-gradient(black 2px, transparent 0)",
        backgroundPosition: "0px -36px",
        backgroundSize: "40px 40px",
        height: "100vh",
        position: "relative",
    }
}))

export interface IOperationViewProps {
}

type OperationViewParams = {
    connectionId: string
}

const OperationView = (props: IOperationViewProps) => {
    // const { setHeaderBody, tabId } = props
    const params = useParams<OperationViewParams>()
    const tabId = '0'
    const classes = useStyles()
    const actualTab = useTab(tabId)
    const [initializedTab, setInitializedTab] = useState("")
    const connection = useConnection(tabId)
    const dispatcher = useTabsDispatch()
    const [operationComponents, setOperationComponents] = useState<IOperationComponent[]>([])

    const handleOnCloseOperationComponent = useCallback((id: string) => {
        setOperationComponents(op => {
            return op.filter(item => item.id !== id)
        })
        dispatcher({ type: "remove-component", tabId, componentId: id })
    }, [dispatcher, tabId])

    const handleOnAddOperationComponent = useCallback((descriptor: IOperationComponentDescriptor) => {
        // const componentBuilder: IOperationComponentBuilder = {
        //     id: uuid(),
        //     tabId: tabId,
        //     name: descriptor.name,
        //     type: descriptor.type,
        //     settings: descriptor.settings,
        //     component: descriptor.component,
        //     onClose: handleOnCloseOperationComponent,
        // }
        // const componentSpecific: IOperationComponentSpecifics<unknown> = {
        //     moduleId: '',
        //     connectionId: tabId,
        //     onCommitComponentSpecific: <TComponentSpecific,>(specifics: TComponentSpecific) => { },
        //     specifics: {},
        // }
        // const layoutComponent = makeOperationComponentLayoutItem(componentBuilder, componentSpecific)
        // dispatcher({
        //     type: "add-component", tabId: tabId, payload:
        //         { builder: componentBuilder, specifics: componentSpecific }
        // })
        // setOperationComponents([...operationComponents, layoutComponent])
    }, [dispatcher, handleOnCloseOperationComponent, tabId, operationComponents])

    useEffect(() => {
        if (initializedTab === actualTab.id) {
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
            setOperationComponents(recoveredOperationComponents)
        }
        setInitializedTab(actualTab.id)
    }, [actualTab, dispatcher, handleOnCloseOperationComponent, initializedTab, tabId])

    useEffect(() => {
        // const operationCategoryFiltered: IOperationCategory[] = makeOperationBar(operationComponentsConfiguration, connection?.modules ?? [])
        // setHeaderBody(
        //     <OperationHeader
        //         mountComponent={handleOnAddOperationComponent}
        //         operationCategories={operationCategoryFiltered}
        //         connectionId={tabId}
        //     />
        // )
    }, [handleOnAddOperationComponent, connection, tabId])

    return (
        <>
            <div className={classes.root} >
                {operationComponents.map((e: IOperationComponent) => {
                    // const OperationComponent = e.operationComponent
                    return (
                        <e.operationComponent
                            key={e.id}
                        />
                    )
                })}
            </div>
        </>
    )
}

export default OperationView