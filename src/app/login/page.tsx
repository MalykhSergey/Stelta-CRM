"use client"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect } from "react"
import { login } from "../../models/User/UserService"
import { useAuth } from "../AuthContext"
import { showMessage } from "../components/Alerts/Alert"
import styles from "./page.module.css"

export default function LoginPage() {
    const router = useRouter()
    const authContext = useAuth()
    useEffect(() => {
        if (authContext.user.name != "") {
            showMessage(`Добро пожаловать ${authContext.user.name}!`, "successful")
            router.push('/')
        }
    }, []);
    const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const loginForm = new FormData(e.currentTarget)
        const result = await login(loginForm)
        if (!("error" in result)) {
            const name = loginForm.get("name") as string
            showMessage(`Добро пожаловать ${name}!`, "successful")
            if (localStorage.getItem("version") != process.env.APP_VERSION)
                showMessage(`Новая версия ${process.env.APP_VERSION}. <a href="./changelog">Узнать больше</a>`, "info", 3000)
            localStorage.setItem("version", process.env.APP_VERSION || 'error')
            authContext.setUser(result)
            router.push('/')
        } else {
            showMessage(result.error, "error");
        }
    }
    return (
        <form onSubmit={loginHandler} className={`card ${styles.login}`}>
            <h1 className={`${styles.header}`}>Вход в систему</h1>
            <div>
                <label className={styles.label} htmlFor="name">Имя пользователя:</label>
                <input type="text" id="name" name="name" placeholder="Имя пользователя" required />
            </div>
            <div>
                <label className={styles.label} htmlFor="name">Пароль:</label>
                <input type="password" id="password" name="password" placeholder="Пароль" required />
            </div>
            <button className={`${styles.submit} BlueButton`}>Войти</button>
        </form>
    )
}