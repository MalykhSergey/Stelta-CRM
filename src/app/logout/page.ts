"use client"
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "../AuthContext";
import {showMessage} from "../components/Alerts/Alert";
import {logout} from "../../models/User/UserService";
import { User } from "@/models/User/User";


export default function LogOutPage() {
    const router = useRouter()
    const authContext = useAuth()
    useEffect(() => {
        const performLogout = async () => {
            authContext.setUser(new User())
            await logout();
            showMessage("Вы вышли из системы!");
            router.push("/login");
        };
        performLogout();
    }, []);
}
