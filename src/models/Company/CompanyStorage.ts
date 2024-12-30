import connection, { handleDatabaseError } from "@/config/Database";
import Company from "@/models/Company/Company";
import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import { ContactPerson } from "./ContactPerson/ContactPerson";

export default class CompanyStorage {
    static async getCompaniesWithPersons() {
        const companies_rows = (await connection.query(`SELECT * FROM companies ORDER BY "name"`)).rows;
        return await Promise.all(companies_rows.map(async row => {
            const company = new Company(row.id, row.name);
            const personsByCompanyId = await ContactPersonStorage.getContactPersonsByCompanyId(row.id);
            if (!('error' in personsByCompanyId))
                company.contactPersons = personsByCompanyId as ContactPerson[]
            return company
        }))
    }

    static async createCompany(name: string) {
        try {
            return (await connection.query(`INSERT INTO companies("name") values($1) RETURNING id`, [name])).rows[0].id
        } catch (e) {
            return handleDatabaseError(e,
                {'23505': 'Невозможно создать организацию: такая уже есть.'},
                'Ошибка создания организации.');
        }
    }

    static async updateCompany(id: number, name: string) {
        try {
            await connection.query(`UPDATE companies SET "name" = $1 WHERE id = $2`, [name, id])
        } catch (e) {
            return handleDatabaseError(e,
                {'23505': 'Невозможно обновить организацию: такая уже есть.'},
                'Ошибка обновления организации.');
        }
    }

    static async deleteCompany(id: number) {
        try {
            await connection.query(`DELETE FROM companies WHERE id = $1`, [id])
        } catch (e) {
            return handleDatabaseError(e,
                {'23503': 'Невозможно удалить организацию: существуют связанные тендера или контактные лица.'},
                'Ошибка удаления организации.');
        }
    }

    static async getCompanies() {
        return (await connection.query(`SELECT * FROM companies ORDER BY "name"`)).rows;
    }
}