"use client"
import { createContext, useContext, useState } from "react";
const AuthContext = createContext({ userName: null, setUserName: (name: string) => { } });

export function AuthProvider({ children, initialAuth }: any) {
    const [userName, setUserName] = useState(initialAuth);
    return (
        <AuthContext.Provider value={{ userName: userName, setUserName: setUserName }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}
