import conn from "@/config/Database";
import {PoolClient} from "pg";

export default class TransactionManager {
    static async begin(){
        const connection = await conn.connect()
        connection.query("BEGIN TRANSACTION;")
        return connection
    };
    static commit(transaction:PoolClient){
        transaction.query("COMMIT TRANSACTION;")
        transaction.release()
    };
    static roll_back(transaction:PoolClient){
        transaction.query("ROLLBACK;")
        transaction.release()
    };
}