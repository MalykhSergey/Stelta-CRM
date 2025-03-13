"use server"

import jwt from 'jsonwebtoken'
import {cookies} from 'next/headers'
import {Role, User} from './User'
import {createUser, deleteUser as UserStorage_deleteUser, getUserByName, getUsers, hash_password} from "./UserStorage"

export async function register(registerForm: FormData) {
    const name = registerForm.get('name') as string
    const password = registerForm.get('password') as string
    const role = registerForm.get('role') as Role
    return authAction(async (user) => {
        if (user.role != Role.Admin) return {error: "Вы не можете регистрировать пользователей!"}
        return createUser(name, password, role)
    })
}

export async function deleteUser(id: number) {
    return authAction(async (user) => {
        if (user.role != Role.Admin) return {error: "Вы не можете удалять пользователей!"}
        return UserStorage_deleteUser(id)
    })
}

export async function loadUsers() {
    return getUsers();
}

const expirationTime = process.env.JWT_EXP_TIME || '1h';

export async function login(loginForm: FormData) {
    const user = await getUserByName(loginForm.get('name') as string)
    if (user) {
        const hashed_password = hash_password(loginForm.get("password") as string, user.salt)
        if (user.password != hashed_password)
            return {error: "Неправильный пароль!"}
        user.password = hashed_password
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                password: user.password,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {expiresIn: expirationTime}
        );
        const cookiesStore = await cookies()
        cookiesStore.set('auth_token', token, {httpOnly: true, maxAge: 3600 * 24 * 7})
        return {name: user.name, role: user.role} as User
    }
    return {error: "Пользователь с таким именем не найден!"}
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
            if (found_user != null && found_user.password == user_in_token.password && found_user.role == user_in_token.role && found_user.role != Role.Viewer) {
                return handler(user_in_token);
            } else {
                cookiesStore.delete("auth_token")
                return {error: "Попытка неавторизованного доступа! Возможно ошибка в системе. Войдите в систему заново."}
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                const decoded_token = jwt.decode(auth_token.value) as User
                const found_user = await getUserByName(decoded_token.name)
                // Сразу отсекаем Role.Viewer
                if (found_user != null && found_user.password == decoded_token.password && found_user.role == decoded_token.role && found_user.role != Role.Viewer) {
                    const new_token = jwt.sign(
                        {
                            id: decoded_token.id,
                            name: decoded_token.name,
                            password: decoded_token.password,
                            role: decoded_token.role
                        },
                        process.env.JWT_SECRET!,
                        {expiresIn: expirationTime}
                    )
                    cookiesStore.set('auth_token', new_token, {httpOnly: true, maxAge: 3600 * 24 * 7})
                    return handler(decoded_token as User);
                }
            }
            cookiesStore.delete("auth_token")
            return {error: "Попытка неавторизованного доступа! Войдите в систему."}
        }
    } else
        return {error: "Попытка неавторизованного доступа! Войдите в систему."}
}

export async function getUserCredentials() {
    const cookiesStore = await cookies()
    const auth_token = cookiesStore.get('auth_token')
    if (auth_token) {
        const auth_user = jwt.decode(auth_token.value) as User
        if (auth_user != null) {
            return {
                name: auth_user.name,
                role: auth_user.role
            } as User
        }
    }
    return new User()
}

export async function authorize() {
    const cookiesStore = await cookies()
    const auth_token = cookiesStore.get('auth_token')
    if (!auth_token)
        return false
    try {
        const auth_user = jwt.verify(auth_token.value, process.env.JWT_SECRET!) as User
        if (auth_user != null)
            return true
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            const decoded_token = jwt.decode(auth_token.value) as User
            const new_token = await tryUpdateToken(decoded_token)
            if (new_token) {
                cookiesStore.set('auth_token', new_token, {httpOnly: true, maxAge: 3600 * 24 * 7})
                return true
            }
        }
        cookiesStore.delete("auth_token")
    }
    return false
}


export async function tryUpdateToken(decoded_token: User) {
    const found_user = await getUserByName(decoded_token.name)
    if (found_user != null && found_user.password == decoded_token.password) {
        return jwt.sign(
            {
                id: decoded_token.id,
                name: decoded_token.name,
                password: decoded_token.password,
                role: found_user.role
            },
            process.env.JWT_SECRET!,
            {expiresIn: expirationTime}
        );
    }
    return null;
}