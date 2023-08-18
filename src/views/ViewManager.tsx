import React from "react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useActiveTab, useTabs } from "../contexts/TabContext";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";
import MenuVerticalTabs from "../components/MenuVerticalTab";
import { Box, CssBaseline } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { UserLight, UserModel } from "../api/models/user.model";
import OrganizationPage from "./OrganizationPage";

export interface IHeaderMenuState {
}

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();
    const tabs = useTabs()
    const activeTab = useActiveTab()
    const { user } = useAuth() as { user: UserModel | UserLight }
    const isUserLight = user.email == null

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
                    <MenuVerticalTabs onSelectTab={(v) => { setViewType(v) }} isLightUser={isUserLight} />
                    {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} />}
                    {(!isUserLight && viewType === ViewType.Organization) && <OrganizationPage user={user as UserModel} />}
                </Box>
            )}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeTab?.id ?? ""} setHeaderBody={setHeaderBody} />}
        </>
    );
}

export default ViewManager