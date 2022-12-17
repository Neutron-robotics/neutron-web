import { createContext, Dispatch, useContext, useReducer } from 'react';
import { IOperationComponentBuilder, IOperationComponentSettings, IOperationComponentSpecifics } from '../components/OperationComponents/IOperationComponents';

export interface IOperationTabData {
    components: Record<string, { builder: IOperationComponentBuilder, specifics: IOperationComponentSpecifics<unknown> }>
}

interface ITabDispatchAction {
    type: 'update' | 'remove-tab';
    payload: IOperationTabData;
    tabId: string
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

type TabDispatchesActions = ITabDispatchAction | CommitDispatchAction<unknown> | RemoveComponentDispatchAction | AddComponentDispatchAction<unknown>

export type ITabsContext = Record<string, IOperationTabData>;

const TabsContext = createContext<ITabsContext>({});

const TabsDispatchContext = createContext<Dispatch<TabDispatchesActions>>(null as any);

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
        case 'add-component': {
            const { tabId, payload } = action
            const tab = tabs[tabId]
            if (!tab) {
                console.log("no such tab exist")
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
                console.log("no such tab exist")
                return tabs
            }
            if (!componentId || !tab.components[componentId]) {
                console.log('Invalid componentId or tabId', componentId, tabId)
                return tabs
            }
            console.log('Committing', componentId, payload, specifics)
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
        case 'remove-tab': {
            const { tabId } = action
            const { [tabId]: _, ...rest } = tabs
            return rest
        }
        case 'remove-component': {
            const { tabId, componentId } = action
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

const initialTabs = {}