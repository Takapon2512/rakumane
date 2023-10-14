import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

//type
import { ResUserType } from "@/types/globaltype";

//lib
import { apiClient } from "@/lib/apiClient";

interface AuthContextType {
    user: ResUserType | null;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<ResUserType | null>(null);
    const router = useRouter();

    useEffect(() => {
        const cookie: string = document.cookie;
        const token: string = cookie.split("=")[1];

        if (token) {
            apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
            apiClient.get("/user/find").then((res) => {
                setUser(res.data);
            }).catch((err) => {
                console.error(err);
                router.push("/login");
            });

            apiClient.get("/word/db_search");
        };
        
    }, []);

    const login = async (token: string) => {
        
        document.cookie = `auth_token=${token};`;

        try {
            apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
            apiClient.get("/user/find").then(res => setUser(res.data));
        } catch (err) {
            console.error(err);
        };
    };

    const logout = () => {
        if (user) {
            //cookieをすべて削除（たまに2つ以上トークンが生成されるため）
            document.cookie.split(';')
            .forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;max-age=${0};`));
    
            delete apiClient.defaults.headers["Authorization"];
            setUser(null);
        };
    };

    const value: AuthContextType = {
        user: user,
        login: login,
        logout: logout
    };

    return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
};