import OperationSandbox from "../components/OperationSandbox";
import { useCallback, useContext, useEffect, useState } from 'react';
import { ILayoutCoordinates, IOperationCategory, IOperationComponentBuilder, IOperationComponentLayoutItem } from '../components/OperationComponents/IOperationComponents';
import { operationComponentsConfiguration } from '../components/OperationComponents/components';
import { makeOperationComponentLayoutItem } from "../components/OperationComponents/OperationComponentFactory";
import { IRobotModule, makeModule } from "neutron-core";
import IViewProps from "./IView";
import OperationHeader from "../components/Header/OperationHeader";
import { IHeaderMenuState } from "./ViewManager";
import { MultiConnectionContext } from "../contexts/MultiConnectionProvider";
import { v4 as uuid } from "uuid";

export interface IOperationMenuState extends IHeaderMenuState {
    layout: IOperationComponentLayoutItem[]
    modules: IRobotModule[]
}

export interface IOperationViewProps extends IViewProps {
    commitOperationLayout: (menu: string, viewState: IOperationMenuState) => void;
    viewState?: IOperationMenuState;
    id: string
}

const OperationView = (props: IOperationViewProps) => {
    const { setHeaderBody, id, commitOperationLayout, viewState } = props;
    const [headerCategories, setHeaderCategories] = useState<IOperationCategory[]>([])
    const [operationComponentLayoutItems, setOperationComponentLayoutItems] = useState<IOperationComponentLayoutItem[]>([])
    const [modules, setModules] = useState<IRobotModule[]>([])
    const { connections } = useContext(MultiConnectionContext)
    const context = connections[id]?.context
    const [currentId, setCurrentId] = useState<string>(uuid())

    useEffect(() => {
        setHeaderCategories(operationComponentsConfiguration)
    }, [])

    const onLayoutComponentPositionUpdate = (pos: ILayoutCoordinates, id: string) => {
        console.log("update layout component position", pos, id)
        setOperationComponentLayoutItems((prev) => {
            console.log("prev", prev)
            const updated = prev.map((e) => {
                if (e.name === id) {
                    console.log("saving position", pos, "for", id)
                    return {
                        ...e,
                        defaultPosition: pos
                    }
                }
                return e
            })
            return updated
        })
    }

    useEffect(() => {
        if (id !== currentId) {
            console.log("Id changed", id, currentId)
            console.log("set save", viewState)
            setCurrentId(id)
            setOperationComponentLayoutItems(viewState?.layout || [])
            setModules(viewState?.modules || [])
            return () => {
                console.log("commit", currentId, operationComponentLayoutItems, modules)
                commitOperationLayout(currentId, {
                    layout: operationComponentLayoutItems,
                    modules,
                })
            }
        }
    }, [commitOperationLayout, currentId, id, modules, operationComponentLayoutItems, viewState])

    const unmountComponentLayoutItem = useCallback((name: string) => {
        setOperationComponentLayoutItems(operationComponentLayoutItems.filter(item => item.id !== name))
    }, [operationComponentLayoutItems])

    const mountComponent = useCallback((component: IOperationComponentBuilder) => {
        console.log(component)
        if (component.needModule && !context) {
            console.log("No context")
            return
        }
        let module = modules.find(m => m.type === component.type)
        if (!module && component.needModule && context) {
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
            onPositionUpdate: onLayoutComponentPositionUpdate,
            module: module
        })
        console.log("make layout")
        setOperationComponentLayoutItems([...operationComponentLayoutItems, layoutComponent])
    }, [context, modules, operationComponentLayoutItems, unmountComponentLayoutItem])

    useEffect(() => {
        setHeaderBody(
            <OperationHeader
                onConnectClick={() => { }}
                onDisconnectClick={() => { }}
                mountComponent={mountComponent}
                isConnected={false}
                batteryLevel={100}
                wifiLevel={100}
                parts={headerCategories}
            />
        )
    }, [headerCategories, mountComponent, setHeaderBody])

    return (
        <>
            <OperationSandbox
                onComponentClose={unmountComponentLayoutItem}
                components={operationComponentLayoutItems}
            />
        </>
    )
}

export default OperationView