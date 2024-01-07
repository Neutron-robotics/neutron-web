import { makeStyles } from "@mui/styles"
import { Route, Routes } from "react-router-dom"
import LoginView from "./LoginView"
import HomeView from "./HomeView";
import ConnectionView from "./ConnectionView";
import NeutronView from "./NeutronView";
import OperationView from "./OperationView";
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

const useStyles = makeStyles(() => ({

}))

interface RouteManagerProps {

}

const RouteManager = () => {
    const classes = useStyles();

    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />

            <Route
                path="/*"
                element={
                    <MainLayout>
                        <Routes>
                            <Route index element={<HomeView />} />
                            <Route path="/connection" element={<ConnectionView />} />
                            <Route path="/organization" element={<OrganizationView />} />
                            <Route path="/organization/:organizationId" element={<OrganizationView />} />
                            <Route path="/organization/:organizationId/robot/:robotId" element={<RobotView />} />
                            <Route path="/organization/:organizationId/robot/:robotId/part/:partId" element={<RobotPartView />} />
                            <Route path="/neutron" element={<NeutronGraphProvider> <NeutronView /></NeutronGraphProvider>} />
                            <Route path="/operation/:tabId" element={<OperationView />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </MainLayout>
                }
            />

            {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
    );
};

const MainLayout = (props: PropsWithChildren<RouteManagerProps>) => {
    const { children } = props

    return (
        <ProtectedRoute>
            <>
                <Header headerTabs={[]} />
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