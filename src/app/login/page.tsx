"use client"
import {useRouter} from "next/navigation"
import {FormEvent, useEffect} from "react"
import {useAuth} from "../AuthContext"
import {showMessage} from "../components/Alerts/Alert"
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
        const name = loginForm.get("name") as string
        const result = await (await fetch(`/api/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {name: name, password: loginForm.get("password")})
        })).json()
        if (!("error" in result)) {
            showMessage(`Добро пожаловать ${name}!`, "successful")
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
                <input type="text" id="name" name="name" placeholder="Имя пользователя" required/>
            </div>
            <div>
                <label className={styles.label} htmlFor="name">Пароль:</label>
                <input type="password" id="password" name="password" placeholder="Пароль" required/>
            </div>
            <button className={`${styles.submit} BlueButton`}>Войти</button>
        </form>
    )
}