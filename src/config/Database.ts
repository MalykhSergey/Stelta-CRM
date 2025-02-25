import {DatabaseError, Pool} from "pg";
import logger from "@/config/Logger";

const conn = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: Number(process.env.PGSQL_PORT),
    database: process.env.PGSQL_DATABASE,
});
conn.on('connect', (client) => {
    client.query("SET TIME ZONE 'Asia/Omsk';")
        .catch(err => console.error('Ошибка установки часового пояса:', err));
});

/**
 * Обработчик ошибок базы данных.
 * @param e - ошибка для обработки
 * @param errorMap - карта кодов ошибок и сообщений для них
 * @param defaultMessage - сообщение, возвращаемое в случае необработанной ошибки
 * @returns Объект с ключом `error` и соответствующим сообщением
 */
export function handleDatabaseError(
    e: unknown,
    errorMap: Record<string, string>,
    defaultMessage: string,
): { error: string } {
    if (e instanceof DatabaseError) {
        for (const [code, message] of Object.entries(errorMap)) {
            if (e.code === code) {
                return { error: message };
            }
        }
        // Логирование необработанной ошибки базы данных
        logger.error(defaultMessage, { code: e.code, details: e.detail });
    } else {
        // Логирование необработанных ошибок, не относящихся к базе данных
        logger.error(defaultMessage, e);
    }
    return { error: defaultMessage };
}
/**
 * Пул соединений. Не использовать conn.query для транзакций!
 */
export default conn;