import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserLight, UserModel } from "../api/models/user.model";
import * as auth from "../api/auth";
import { useNavigate } from "react-router-dom";

type ContextProps = {
    user: UserModel | UserLight | null,
    login: (data: UserModel | UserLight) => void
    logout: () => void
}

export const AuthContext = createContext<ContextProps>({} as any)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | UserLight | null>(null)
    const navigate = useNavigate();

    const getUser = useCallback(async () => {
        const user = await auth.me()
        if (user) {
            setUser(user)
            navigate("/", { replace: true });
        }
    }, [navigate])

    useEffect(() => {
        const loggedIn = auth.tryLoginFromCookie()
        if (loggedIn)
            getUser()
    }, [getUser])

    const login = (user: UserModel | UserLight) => {
        setUser(user)
        navigate("/", { replace: true })
    }

    const logout = () => {
        auth.logout()
        setUser(null)
        navigate("/login", { replace: true });
    }

    return <AuthContext.Provider
        value={{
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