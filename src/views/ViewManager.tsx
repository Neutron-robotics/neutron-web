import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import LoginView from "./LoginView";

export interface IHeaderMenuState {
}

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();
    const tabs = useTabs()
    const activeTab = useActiveTab()

    useEffect(() => {
        if (viewType === ViewType.Home) {
            setHeaderBody(undefined);
        }
    }, [viewType])

    useEffect(() => {
        if (activeTab) {
            setViewType(ViewType.OperationView)
        }
        else if (viewType === ViewType.OperationView)
            setViewType(ViewType.Home)
    }, [activeTab, setViewType, viewType])

    return (
        <>
            <LoginView
                onLogin={(a, b, c) => true}
                onContinueLocalyClick={() => { }}
                onForgetPasswordClick={() => { }}
                onSignUpClick={() => { }}
            />
            {/* <Header headerBody={headerBody} headerTabs={Object.values(tabs)} activeTabId={activeTab?.id} />
            {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} />}
            {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} />}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeTab?.id ?? ""} setHeaderBody={setHeaderBody} />} */}
        </>
    );
}

export default ViewManager