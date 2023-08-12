import { createContext, ReactNode, useState } from "react";

export enum ViewType {
    Home,
    ConnectionView,
    OperationView,
    Organization,
    Neutron,
    Settings
}

export interface IViewContext {
    viewType: ViewType
    setViewType: (viewType: ViewType) => void
}

export const ViewContext = createContext<IViewContext>({
    viewType: ViewType.Home,
    setViewType: (viewType: ViewType) => { }
});

export const ViewProvider = ({ children }: { children: ReactNode }) => {
    const [viewType, setViewType] = useState<ViewType>(ViewType.Home);

    return (
        <ViewContext.Provider value={{ viewType, setViewType }}>
            {children}
        </ViewContext.Provider>
    );
}