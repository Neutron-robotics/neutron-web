import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import * as auth from "../api/auth";
import { useNavigate } from "react-router-dom";

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

    const getUser = useCallback(async () => {
        const user = await auth.me()
        if (user) {
            setUser(user)
        }
    }, [navigate])

    useEffect(() => {
        if (loggedIn)
            getUser()
    }, [getUser])

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

    if (!auth.isSessionValid()) {
        navigate("/login", { replace: true });
        setUser(null)
        setLoggedIn(false)
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