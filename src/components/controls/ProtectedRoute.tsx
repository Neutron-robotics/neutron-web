import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactElement<any> }) => {
    const { loggedIn } = useAuth();
    if (!loggedIn) {
        return <Navigate to="/login" />;
    }
    return children;
};