"use server"

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from './User'
import { createUser, getUserByName, getUserNames, hash_password } from "./UserStorage"
import logger from "@/config/Logger";

export async function register(registerForm: FormData) {
    const name = registerForm.get('name') as string
    const password = registerForm.get('password') as string
    return createUser(name, password)
}

export async function loadUserNames() {
    return getUserNames();
}

const expirationTime = '1h'
export async function login(loginForm: FormData) {
    const user = await getUserByName(loginForm.get('name') as string)
    if (!user)
        return { error: "Пользователь с таким именем не найден!" }
    if (user) {
        if (user.password != hash_password(loginForm.get("password") as string, user.salt))
            return { error: "Неправильный пароль!" }
        const token = jwt.sign(
            user,
            process.env.JWT_SECRET!,
            { expiresIn: expirationTime }
        );
        const cookiesStore = await cookies()
        cookiesStore.set('auth_token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 })
    }
}

export async function logout() {
    const cookieStorage = await cookies()
    cookieStorage.delete("auth_token")
}

export async function authAction<T>(handler: (user: User) => Promise<T>) {
    const cookiesStore = await cookies()
    const auth_token = cookiesStore.get('auth_token')
    if (auth_token) {
        try {
            const decoded_token = jwt.verify(auth_token.value, process.env.JWT_SECRET!)
            return handler(decoded_token as User);
        } catch (e) {
            logger.error(e)
            if (e instanceof jwt.TokenExpiredError) {
                const decoded_token = jwt.decode(auth_token.value) as User
                const new_token = jwt.sign(
                    { id: decoded_token.id, name: decoded_token.name, password: decoded_token.password, salt: decoded_token.salt },
                    process.env.JWT_SECRET!,
                    { expiresIn: expirationTime }
                )
                cookiesStore.set('auth_token', new_token, { httpOnly: true, maxAge: 3600 * 24 * 7 })
                return handler(decoded_token as User);
            }
            return { error: "Попытка неавторизованного доступа! Войдите в систему." }
        }
    } else
        return { error: "Попытка неавторизованного доступа! Войдите в систему." }
}

export async function checkAuth() {
    const cookiesStore = await cookies()
    const auth_token = cookiesStore.get('auth_token')
    if (auth_token) {
        const auth_user = jwt.decode(auth_token.value) as User
        return auth_user.name
    }
    return ''
}
