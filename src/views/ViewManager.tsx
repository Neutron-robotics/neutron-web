import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import MenuVerticalTabs from "../components/MenuVerticalTab";
import { Box, CssBaseline } from "@mui/material";
import OrganizationView from "./OrganizationView";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { UserLight, UserModel } from "../api/models/user.model";

export interface IHeaderMenuState {
}

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();
    const tabs = useTabs()
    const activeTab = useActiveTab()
    const { user } = useAuth() as { user: UserModel | UserLight }

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

    console.log("user", user)

    if (!user) {
        console.log("navigating")
        return <Navigate to="/login" />;
    }

    const hasMenu = viewType === ViewType.Home ||
        viewType === ViewType.ConnectionView ||
        viewType === ViewType.Organization ||
        viewType === ViewType.Neutron ||
        viewType === ViewType.Settings

    return (
        <>

            <Header user={user} headerBody={headerBody} headerTabs={Object.values(tabs)} activeTabId={activeTab?.id} />
            {hasMenu && (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <MenuVerticalTabs onSelectTab={(v) => { setViewType(v) }} isLightUser={user?.email !== undefined} />
                    {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(viewType === ViewType.Organization) && <OrganizationView user={user as UserModel} />}
                </Box>
            )}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeTab?.id ?? ""} setHeaderBody={setHeaderBody} />}
        </>
    );
}

export default ViewManager