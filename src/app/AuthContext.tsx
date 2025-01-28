"use client"
import { User } from "@/models/User/User";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
    user: User
    setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({
    user: new User(), setUser: () => {
    }
})


export function AuthProvider({ children, initialAuth }: { children: React.ReactNode, initialAuth: User }) {
    const [user, setUser] = useState(initialAuth);
    return (
        <AuthContext.Provider value={{ user: user, setUser: (setUser) }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
