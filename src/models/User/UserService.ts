"use server"

import logger from "@/config/Logger"
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from './User'
import { createUser, getUserByName, getUsers, hash_password, deleteUser as UserStorage_deleteUser } from "./UserStorage"

export async function register(registerForm: FormData) {
    const name = registerForm.get('name') as string
    const password = registerForm.get('password') as string
    return authAction(async (user) => {
        if (user.name != process.env.ADMIN_LOGIN) return { error: "Вы не можете регистрировать пользователей!" }
        return createUser(name, password)
    })
}

export async function deleteUser(id: number) {
    return authAction(async (user) => {
        if (user.name != process.env.ADMIN_LOGIN) return { error: "Вы не можете удалять пользователей!" }
        return UserStorage_deleteUser(id)
    })
}

export async function loadUsers() {
    return getUsers();
}

const expirationTime = '1h'
export async function login(loginForm: FormData) {
    const user = await getUserByName(loginForm.get('name') as string)
    if (!user)
        return { error: "Пользователь с таким именем не найден!" }
    if (user) {
        const hashed_password = hash_password(loginForm.get("password") as string, user.salt)
        if (user.password != hashed_password)
            return { error: "Неправильный пароль!" }
        user.password = hashed_password
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
            const user_in_token = decoded_token as User
            const found_user = await getUserByName(user_in_token.name)
            if (found_user != null && found_user.password == user_in_token.password) {
                return handler(decoded_token as User);
            }
            else {
                cookiesStore.delete("auth_token")
                return { error: "Попытка неавторизованного доступа! Возможно ошибка в системе. Войдите в систему заново." }
            }
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
        return auth_user != null ? auth_user.name : ''
    }
    return ''
}
