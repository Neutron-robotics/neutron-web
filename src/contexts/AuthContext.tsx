import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import * as auth from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./AlertContext";

type ContextProps = {
    user: UserModel | null,
    loggedIn: boolean
    login: (data: UserModel) => void
    logout: () => void
}

export const AuthContext = createContext<ContextProps>({} as any)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | null>(null)
    const [loggedIn, setLoggedIn] = useState(auth.tryLoginFromCookie())
    const navigate = useNavigate();
    const alert = useAlert()

    const getUser = useCallback(async () => {
        const user = await auth.me()
        if (user) {
            setUser(user)
        }
    }, [])

    useEffect(() => {
        if (loggedIn)
            getUser()
    }, [getUser, loggedIn])

    const login = (user: UserModel) => {
        setUser(user)
        setLoggedIn(true)
    }

    const logout = () => {
        auth.logout()
        setLoggedIn(false)
        setUser(null)
        navigate("/login", { replace: true });
    }

    if (loggedIn && user && !auth.isSessionValid()) {
        alert.info("Your session has expired, please re-connect")
        setLoggedIn(false)
        setUser(null)
        navigate("/login", { replace: true });
    }

    return <AuthContext.Provider
        value={{
            loggedIn,
            user,
            login,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};