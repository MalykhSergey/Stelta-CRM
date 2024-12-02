import crypto from "crypto";
import connection from "./Database";
import {User} from "./User";


export function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex')
}

export function hash_password(password: crypto.BinaryLike, salt: crypto.BinaryLike) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
}

export async function createUser(name: string, password: string) {
    const salt = generateSalt()
    const hashed_password = hash_password(password, salt)
    try {
        await connection.query("INSERT INTO users(name, password, salt) VALUES ($1,$2,$3)", [name, hashed_password, salt]);
    }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        if (error.code === '23505')
            return {error: 'Пользователь с таким именем уже есть!'};
        return {error: 'Ошибка создания пользователя!'};
    }
}

export async function getUserNames(): Promise<{ name: string }[]> {
    return (await connection.query("SELECT name FROM users")).rows;
}

export async function getUserByName(name: string): Promise<User | null> {
    return (await connection.query("SELECT * FROM users WHERE name = $1", [name])).rows[0];
}