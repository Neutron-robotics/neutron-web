import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import LoginView from "./LoginView";
import { UserModel } from "../api/models/user.model";
import { login, me } from "../api/auth";

export interface IHeaderMenuState {
}

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();
    const tabs = useTabs()
    const activeTab = useActiveTab()
    const [user, setUser] = useState<UserModel>()

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

    useEffect(() => {
        if (user && viewType === ViewType.Login) {
            setViewType(ViewType.Home)
        }

        if (!user) {
            setViewType(ViewType.Login)
        }
    }, [setViewType, user, viewType])

    const handleLogin = async (email: string, password: string, remember: boolean) => {
        const toto = await login(email, password)
        console.log("tok", toto)
        const user = await me()
        console.log("user", user)

        if (user) {
            setUser(user)
        }

        if (remember) {

        }
    }

    return (
        <>
            {(viewType === ViewType.Login) &&
                <LoginView
                    onLogin={handleLogin}
                    onContinueLocalyClick={() => { }}
                    onForgetPasswordClick={() => { }}
                    onSignUpClick={() => { }}
                />
            }
            {(viewType !== ViewType.Login) && <Header headerBody={headerBody} headerTabs={Object.values(tabs)} activeTabId={activeTab?.id} />}
            {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} />}
            {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} />}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeTab?.id ?? ""} setHeaderBody={setHeaderBody} />}
        </>
    );
}

export default ViewManager