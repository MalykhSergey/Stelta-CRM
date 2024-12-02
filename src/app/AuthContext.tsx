"use client"
import {createContext, useContext, useState} from "react";

type AuthContextType = {
    userName: string
    setUserName: (name: string) => void
}

const AuthContext = createContext<AuthContextType>({userName: '', setUserName: () => {}})


export function AuthProvider({children, initialAuth}: { children: React.ReactNode, initialAuth: string }) {
    const [userName, setUserName] = useState(initialAuth);
    return (
        <AuthContext.Provider value={{userName: userName, setUserName: (setUserName)}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
