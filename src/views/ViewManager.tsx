import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import LoginView from "./LoginView";
import { UserLight, UserModel } from "../api/models/user.model";
import { login, logout, me, tryLoginFromCookie } from "../api/auth";
import MenuVerticalTabs from "../components/MenuVerticalTab";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
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
        const loggedIn = tryLoginFromCookie()

        if (loggedIn && !user) {
            getUser()
        }
        else if (!user)
            setViewType(ViewType.Login)
    }, [setViewType, user])

    useEffect(() => {
        if (user && (viewType === ViewType.Login || viewType === ViewType.Loading)) {
            setViewType(ViewType.Home)
        }
    }, [setViewType, user, viewType])

    const handleLogin = async (email: string, password: string) => {
        await login(email, password)
        await getUser()
    }

    const getUser = async () => {
        const user = await me()
        if (user) {
            setUser(user)
        }
    }

    const handleDisconnect = () => {
        logout()
        setUser(undefined)
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

    return (
        <>
            {viewType === ViewType.Loading ? (<>
                <CircularProgress />
            </>) : (
                <>
                    {(viewType === ViewType.Login) &&
                        <LoginView
                            onLogin={handleLogin}
                            onContinueLocalyClick={handleContinueLocaly}
                            onForgetPasswordClick={() => { }}
                            onSignUpClick={() => { }}
                        />
                    }
                    {(viewType !== ViewType.Login && user) && <Header handleDisconnect={handleDisconnect} user={user} headerBody={headerBody} headerTabs={Object.values(tabs)} activeTabId={activeTab?.id} />}
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
            )}
        </>
    );
}

export default ViewManager