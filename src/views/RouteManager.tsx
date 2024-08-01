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
import TitleRoute from "../components/controls/TitleRoute";
import AdminView from "./AdminView";
import RegisterView from "./RegisterView";
import CGUView from "./CGUView";
import Verify from "./VerifyView";
import { ConnectionProvider } from "../contexts/ConnectionContext";
import SettingsView from "./SettingsView";

interface RouteManagerProps {

}

const RouteManager = () => {
    return (
        <Routes>
            <Route path="/login" element={<TitleRoute title="Login"><LoginView /></TitleRoute>} />
            <Route path="/verify/:verificationKey" element={<TitleRoute title="Verify"><Verify /></TitleRoute>} />
            <Route path="/cgu" element={<TitleRoute title="CGU"><CGUView /></TitleRoute>} />
            <Route path="/register/:registrationKey" element={<TitleRoute title="Register"><RegisterView /></TitleRoute>} />
            <Route
                path="/*"
                element={
                    <MainLayout>
                        <Routes>
                            <Route index element={<TitleRoute title="Home"><HomeView /></TitleRoute>} />
                            <Route path="/connection/:connectionId" element={<TitleRoute title="Connection"><ConnectionView /></TitleRoute>} />
                            <Route path="/organization" element={<TitleRoute title="Organization"><OrganizationView /></TitleRoute>} />
                            <Route path="/organization/:organizationId" element={<TitleRoute title="Organization"><OrganizationView /></TitleRoute>} />
                            <Route path="/organization/:organizationId/robot/:robotId" element={<TitleRoute title="Robot"><RobotView /></TitleRoute>} />
                            <Route path="/organization/:organizationId/robot/:robotId/part/:partId" element={<TitleRoute title="Part"><RobotPartView /></TitleRoute>} />
                            <Route path="/neutron" element={<TitleRoute title="Graphs"><NeutronGraphProvider> <NeutronView /></NeutronGraphProvider></TitleRoute>} />
                            <Route path="/admin/Users" element={<TitleRoute title="Admin"><AdminView /></TitleRoute>} />
                            <Route path="/admin/Organizations" element={<TitleRoute title="Admin"><AdminView /></TitleRoute>} />
                            <Route path="/admin/Test" element={<TitleRoute title="Test"><AdminView /></TitleRoute>} />
                            <Route path="/settings/account" element={<TitleRoute title="Settings - Account"><SettingsView /></TitleRoute>} />
                            <Route path="*" element={<TitleRoute title="Not Found"><NotFound /></TitleRoute>} />
                        </Routes>
                    </MainLayout>
                }
            />
        </Routes >
    );
};

const MainLayout = (props: PropsWithChildren<RouteManagerProps>) => {
    const { children } = props

    return (
        <ProtectedRoute>
            <ConnectionProvider>
                <>
                    <Header />
                    <Box sx={{ display: 'flex', height: 'calc(100% - 56px)' }}>
                        <CssBaseline />
                        <MenuVerticalTabs />
                        {children}
                    </Box>
                </>
            </ConnectionProvider>
        </ProtectedRoute>
    );
};


export default RouteManager