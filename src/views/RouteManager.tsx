import { Route, Routes } from "react-router-dom"
import LoginView from "./LoginView"
import HomeView from "./HomeView";
import ConnectionView from "./ConnectionView";
import NeutronView from "./NeutronView";
import Header from "../components/Header/Header";
import MenuVerticalTabs from "../components/MenuVerticalTab";
import { PropsWithChildren } from "react";
import { Box, CssBaseline } from "@mui/material";
import { ProtectedRoute } from "../components/controls/ProtectedRoute";
import RobotView from "./RobotView";
import OrganizationView from "./OrganizationView";
import RobotPartView from "./RobotPartView";
import { NeutronGraphProvider } from "../contexts/NeutronGraphContext";
import NotFound from "./NotFound";

interface RouteManagerProps {

}

const RouteManager = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route
                path="/*"
                element={
                    <MainLayout>
                        <Routes>
                            <Route index element={<HomeView />} />
                            <Route path="/connection/:connectionId" element={<ConnectionView />} />
                            <Route path="/organization" element={<OrganizationView />} />
                            <Route path="/organization/:organizationId" element={<OrganizationView />} />
                            <Route path="/organization/:organizationId/robot/:robotId" element={<RobotView />} />
                            <Route path="/organization/:organizationId/robot/:robotId/part/:partId" element={<RobotPartView />} />
                            <Route path="/neutron" element={<NeutronGraphProvider> <NeutronView /></NeutronGraphProvider>} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </MainLayout>
                }
            />
        </Routes>
    );
};

const MainLayout = (props: PropsWithChildren<RouteManagerProps>) => {
    const { children } = props

    return (
        <ProtectedRoute>
            <>
                <Header />
                <Box sx={{ display: 'flex', height: 'calc(100% - 56px)' }}>
                    <CssBaseline />
                    <MenuVerticalTabs />
                    {children}
                </Box>
            </>
        </ProtectedRoute>
    );
};


export default RouteManager