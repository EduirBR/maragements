import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as authService from "../services/authService";
import requests from "../config/requests";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

function getSavedToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getSavedUser() {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getSavedUser);
    const [token, setToken] = useState(getSavedToken);
    const [loading, setLoading] = useState(() => !!getSavedToken());

    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        if (!savedToken) return;

        requests
            .get("/auth/me")
            .then(({ data: res }) => {
                if (res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
                }
            })
            .catch(() => {
                setToken(null);
                setUser(null);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            })
            .finally(() => setLoading(false));
    }, []);

    const saveSession = useCallback((newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem(TOKEN_KEY, newToken);
        if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }, []);

    const clearSession = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    const login = useCallback(
        async (credentials) => {
            const { data: res } = await authService.login(credentials);
            if (res.error) throw new Error(res.message);
            saveSession(res.data.accessToken, res.data.user || null);
            toast.success(res.message);
            return res.data;
        },
        [saveSession],
    );

    const register = useCallback(
        async (data) => {
            const { data: res } = await authService.register(data);
            if (res.error) throw new Error(res.message);
            saveSession(res.data.accessToken, res.data.user);
            toast.success(res.message);
            return res.data;
        },
        [saveSession],
    );

    const logout = useCallback(() => {
        clearSession();
        toast.success("Sesión cerrada");
    }, [clearSession]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
