"use client"
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "../AuthContext";
import {showMessage} from "../components/Alerts/Alert";
import {logout} from "../../models/UserService";


export default function LogOutPage() {
    const router = useRouter()
    const authContext = useAuth()
    useEffect(() => {
        const performLogout = async () => {
            authContext.setUserName('')
            await logout();
            showMessage("Вы вышли из системы!");
            router.push("/");
        };
        performLogout();
    }, []);
}
