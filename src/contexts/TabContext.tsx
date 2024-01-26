import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { IOperationComponentBuilder, IOperationComponentSettings, IOperationComponentSpecifics } from '../components/OperationComponents/IOperationComponents';
import { ViewType } from './ViewProvider';

export interface IOperationTab {
    id: string;
    components: Record<string, { builder: IOperationComponentBuilder, specifics: IOperationComponentSpecifics<unknown> }>

    title: string;
    onClose: () => void;
    onSetActive: () => void;

    isActive: boolean;
    viewType: ViewType;
}

export interface ITabBuilder {
    id: string;
    title: string;
    onClose: () => void;
    onSetActive: () => void;
    viewType: ViewType;

    isActive: boolean
}

interface ITabDispatchAction {
    type: 'update' // is update used ?
    payload: IOperationTab;
    tabId: string
}

interface ITabRemoveAction {
    type: 'remove',
    tabId: string
}

interface CreateTabDispatchAction {
    type: 'create';
    builder: ITabBuilder
}

interface SetActiveTabDispatchAction {
    type: 'set-active';
    active: boolean;
    tabId: string;
}

interface CommitDispatchAction<TComponentSpecific> {
    type: 'commit';
    payload: IOperationComponentSettings
    specifics: TComponentSpecific
    tabId: string
    componentId: string
}

interface RemoveComponentDispatchAction {
    type: 'remove-component';
    tabId: string
    componentId: string
}

interface AddComponentDispatchAction<TComponentSpecific> {
    type: 'add-component';
    tabId: string
    payload: {
        builder: IOperationComponentBuilder
        specifics: IOperationComponentSpecifics<TComponentSpecific>
    }
}

type TabDispatchesActions = ITabDispatchAction |
    CommitDispatchAction<unknown> |
    RemoveComponentDispatchAction |
    AddComponentDispatchAction<unknown> |
    CreateTabDispatchAction |
    SetActiveTabDispatchAction |
    ITabRemoveAction

export type ITabsContext = Record<string, IOperationTab>;

const TabsContext = createContext<ITabsContext>({});

export const TabsDispatchContext = createContext<Dispatch<TabDispatchesActions>>(null as any);

export function TabProvider({ children }: { children: React.ReactNode }) {
    const [tabs, dispatch] = useReducer(
        tabsReducer,
        initialTabs
    )

    return (
        <TabsContext.Provider value={tabs}>
            <TabsDispatchContext.Provider value={dispatch}>
                {children}
            </TabsDispatchContext.Provider>
        </TabsContext.Provider>
    );
}

function tabsReducer(tabs: ITabsContext, action: TabDispatchesActions) {
    switch (action.type) {
        case 'create': {
            const { builder } = action
            if (tabs[builder.id]) {
                return tabs;
            }
            const allTabs = builder.isActive ? Object.entries(tabs).reduce((acc, [key, tab]) => {
                acc[key] = {
                    ...tab,
                    isActive: false
                };
                return acc;
            }, {} as ITabsContext) : tabs
            return {
                ...allTabs,
                [builder.id]: {
                    components: {},
                    ...builder
                }
            }
        }
        case 'set-active': {
            const { tabId, active } = action

            return Object.entries(tabs).reduce((acc, [key, tab]) => {
                acc[key] = {
                    ...tab,
                    isActive: tabId === key ? active : false
                };
                return acc;
            }, {} as ITabsContext)
        }
        case 'add-component': {
            const { tabId, payload } = action
            const tab = tabs[tabId]
            if (!tab) {
                return tabs
            }
            const { builder, specifics } = payload
            return {
                ...tabs,
                [tabId]: {
                    ...tab,
                    components: {
                        ...tab.components,
                        [builder.id]: {
                            builder,
                            specifics
                        }
                    }
                }
            }
        }
        case 'update': {
            const { tabId, payload } = action
            return {
                ...tabs,
                [tabId]: {
                    ...payload
                }
            }
        }
        case 'commit': {
            const { tabId, componentId, payload, specifics } = action
            const tab = tabs[tabId]
            if (!tab) {
                return tabs
            }
            if (!componentId || !tab.components[componentId]) {
                return tabs
            }
            return {
                ...tabs,
                [tabId]: {
                    ...tab,
                    components: {
                        ...tab.components,
                        [componentId]: {
                            ...tab.components[componentId],
                            builder: {
                                ...tab.components[componentId].builder,
                                settings: payload,
                            },
                            specifics: {
                                ...tab.components[componentId].specifics,
                                specifics: specifics
                            }
                        }
                    }
                }
            }
        }
        case 'remove': {
            const { tabId } = action
            const { [tabId]: _, ...rest } = tabs
            return rest
        }
        case 'remove-component': {
            const { tabId, componentId } = action
            if (!tabs[tabId])
                return tabs
            const { [componentId]: _, ...rest } = tabs[tabId].components
            return {
                ...tabs,
                [tabId]: {
                    ...tabs[tabId],
                    components: rest
                }
            }
        }
        default: {
            throw Error('Unknown action: ' + (action as unknown as ITabDispatchAction).type);
        }
    }
}

export function useTabs() {
    return useContext(TabsContext);
}

export function useTabsDispatch() {
    return useContext(TabsDispatchContext);
}

export function useTab(tabId: string) {
    const tabs = useTabs();
    return tabs[tabId];
}

export function useActiveTab() {
    const tabs = useTabs();
    return Object.entries(tabs).map(([_, v]) => v).find((v) => v.isActive)
}

const initialTabs = {}