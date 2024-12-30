import connection, { handleDatabaseError } from "@/config/Database";
import logger from "@/config/Logger";
import { ContactPerson, IContactPerson } from "@/models/Company/ContactPerson/ContactPerson";

export default class ContactPersonStorage {
    static async getContactPersonsByCompanyId(companyId: number): Promise<IContactPerson[] | {error: string}> {
        try {
            return (await connection.query(`SELECT * FROM contact_persons WHERE "company_id" = \$1 ORDER BY "name"`,
                [companyId])).rows.map(row=> {return{id:row.id,name: row.name,phoneNumber: row.phone_number,email: row.email}});
        } catch (e) {
            logger.error(e);
            return {error: "Ошибка получения контактных лиц по ID компании."};
        }
    }

    static async getContactPersonById(id: number): Promise<IContactPerson | {error: string}> {
        try {
            const row = (await connection.query(`SELECT * FROM contact_persons WHERE "id" = \$1 ORDER BY "name"`, [id])).rows[0]
            return {id:row.id,name: row.name,phoneNumber: row.phone_number,email: row.email};
        } catch (e) {
            logger.error(e);
            return {error: "Ошибка получения контактного лица по ID."};
        }
    }

    static async createContactPerson(contactPerson: ContactPerson, companyId: number) {
        try {
            return (await connection.query(`
            INSERT INTO contact_persons("name", "phone_number", "email", "company_id")
            VALUES(\$1, \$2, \$3, \$4) RETURNING id`,
                [contactPerson.name, contactPerson.phoneNumber, contactPerson.email, companyId])).rows[0].id;
        } catch (e) {
            logger.error(e);
            console.log(e)
            return {error: "Ошибка создания контактного лица. Возможно, такие данные уже существуют!"};
        }
    }

    static async updateContactPerson(id: number, contactPerson: string, phoneNumber: string, email: string) {
        try {
            await connection.query(`UPDATE contact_persons SET "contact_person" = \$1, "phone_number" = \$2, "email" = \$3 WHERE id = \$4`, [contactPerson, phoneNumber, email, id]);
        } catch (e) {
            logger.error(e);
            return {error: "Ошибка обновления контактного лица."};
        }
    }

    static async deleteContactPerson(id: number) {
        try {
            await connection.query(`DELETE FROM contact_persons WHERE id = \$1`, [id]);
        } catch (e) {
            return handleDatabaseError(e,
                {'23503': 'Невозможно удалить контактное лицо: существуют связанные тендера или компании.'},
                'Ошибка удаления контактного лица.');
        }
    }
}