import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import LoginView from "./LoginView";
import { UserLight, UserModel } from "../api/models/user.model";
import { login, me } from "../api/auth";
import MenuVerticalTabs from "../components/MenuVerticalTab";
import { Box, CssBaseline } from "@mui/material";
import OrganizationView from "./OrganizationView";

export interface IHeaderMenuState {
}

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();
    const tabs = useTabs()
    const activeTab = useActiveTab()
    const [user, setUser] = useState<UserModel | UserLight>()

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
        await login(email, password)
        const user = await me()
        console.log("user", user)

        if (user) {
            setUser(user)
        }

        if (remember) {

        }
    }

    const handleContinueLocaly = () => {
        setUser({
            firstName: 'guest',
            imgUrl: 'file/anonymous-icon.jpg'
        })
    }

    const hasMenu = viewType === ViewType.Home ||
        viewType === ViewType.ConnectionView ||
        viewType === ViewType.Organization ||
        viewType === ViewType.Neutron ||
        viewType === ViewType.Settings

    console.log("viewtyoe", viewType)

    return (
        <>
            {(viewType === ViewType.Login) &&
                <LoginView
                    onLogin={handleLogin}
                    onContinueLocalyClick={handleContinueLocaly}
                    onForgetPasswordClick={() => { }}
                    onSignUpClick={() => { }}
                />
            }
            {(viewType !== ViewType.Login && user) && <Header user={user} headerBody={headerBody} headerTabs={Object.values(tabs)} activeTabId={activeTab?.id} />}
            {hasMenu && (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <MenuVerticalTabs onSelectTab={(v) => { setViewType(v) }} isLightUser={user?.email !== undefined} />
                    {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(viewType === ViewType.Organization) && <OrganizationView />}
                </Box>
            )}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeTab?.id ?? ""} setHeaderBody={setHeaderBody} />}
        </>
    );
}

export default ViewManager