import crypto from "crypto";
import connection, { handleDatabaseError } from "../../config/Database";
import { User } from "./User";


function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex')
}

export function hash_password(password: crypto.BinaryLike, salt: crypto.BinaryLike) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
}

export async function createUser(name: string, password: string) {
    const salt = generateSalt()
    const hashed_password = hash_password(password, salt)
    try {
        return (await connection.query("INSERT INTO users(name, password, salt) VALUES ($1,$2,$3) RETURNING id", [name, hashed_password, salt])).rows[0].id;
    } catch (e) {
        return handleDatabaseError(e,
            { '23505': 'Пользователь с таким именем уже есть!' },
            'Ошибка создания пользователя!')
    }
}

export async function deleteUser(id: number) {
    try {
        await connection.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (e) {
        return handleDatabaseError(e, {}, 'Ошибка удаления пользователя!');
    }
}
export async function getUsers() {
    return (await connection.query("SELECT id, name FROM users")).rows;
}

export async function getUserByName(name: string): Promise<User | null> {
    return (await connection.query("SELECT * FROM users WHERE name = $1", [name])).rows[0];
}