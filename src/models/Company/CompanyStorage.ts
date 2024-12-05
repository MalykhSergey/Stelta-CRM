import connection from "@/models/Database";

export default class CompanyStorage {
    static async getCompanies() {
        return (await connection.query(`SELECT * FROM companies ORDER BY "name"`)).rows
    }

    static async createCompany(name: string) {
        try {
            return (await connection.query(`INSERT INTO companies("name") values($1) RETURNING id`, [name])).rows[0].id
        } catch {
            return {error: "Ошибка создания организации. Возможно такая уже есть!"}
        }
    }

    static async updateCompany(id: number, name: string) {
        try {
            await connection.query(`UPDATE companies SET "name" = $1 WHERE id = $2`, [name, id])
        } catch {
            return {error: "Ошибка обновления организации."}
        }
    }
    static async deleteCompany(id: number) {
        try {
            await connection.query(`DELETE FROM companies WHERE id = $1`, [id])
        } catch {
            return {error: "Ошибка удаления организации."}
        }
    }
}