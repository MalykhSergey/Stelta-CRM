"use client"
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useRef, useState } from "react";
import { showMessage } from "../components/Alerts/Alert";
import { register } from "../models/UserService";
import styles from "./ClientPage.module.css";

function generatePassword(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export function UsersPage({ userProps }: { userProps: { name: string }[] }) {
    const [users, setUsers] = useState(userProps)
    const password = useRef<HTMLInputElement | null>(null)
    const genClickHandler = () => {
        if (password.current)
            password.current.value = generatePassword(12)
    }
    const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const registerForm = new FormData(e.currentTarget);
        const result = await register(registerForm)
        if (!result?.error) {
            setUsers([...users, { name: registerForm.get('name') as string }])
            showMessage("Пользователь успешно добавлен!", "successful")
        }
        else
            showMessage(result.error)
    }
    return (
        <main className={`${styles.main}`}>
            <form onSubmit={registerHandler} className={`card ${styles.login}`}>
                <h1 className={`${styles.header}`}>Добавить пользователя</h1>
                <div>
                    <label className={styles.label} htmlFor="name">Имя пользователя:</label>
                    <input type="text" id="name" name="name" placeholder="Имя пользователя" required minLength={5}/>
                </div>
                <div>
                    <label className={styles.label} htmlFor="name">Пароль:</label>
                    <input ref={password} type="text" id="password" name="password" placeholder="Пароль" required minLength={8}/>
                    <div className={`${styles.genSpan}`} onClick={genClickHandler}>Сгенерировать пароль</div>
                </div>
                <button className={`${styles.submit} BlueButton`}>Добавить</button>
            </form>
            <div className={`${styles.userList}`}>
                {users.map(user =>
                    <div className={`${styles.userItem} card`} key={user.name}><FontAwesomeIcon icon={faUser} /><h2>{user.name}</h2></div>
                )}
            </div>
        </main >
    )
}