import { Pool } from "pg";

const conn = new Pool({
    user: 'postgres',
    password: 'root',
    host: process.env.PGSQL_HOST,
    port: 5432,
    database: process.env.PGSQL_DATABASE,
});
conn.on('connect', (client) => {
    client.query("SET TIME ZONE 'Asia/Omsk';")
        .catch(err => console.error('Ошибка установки часового пояса:', err));
});

export default conn;