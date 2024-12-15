import connection, {handleDatabaseError} from "@/config/Database";
import logger from "@/config/Logger";

export default class ContactPersonStorage {
    static async getContactPersonsByCompanyId(companyId: number) {
        try {
            return (await connection.query(`SELECT * FROM contact_persons WHERE "company_id" = \$1 ORDER BY "contact_person"`, [companyId])).rows;
        } catch (e) {
            logger.error(e);
            return { error: "Ошибка получения контактных лиц по ID компании." };
        }
    }

    static async createContactPerson(contactPerson: string, phoneNumber: string, email: string, companyId: number) {
        try {
            return (await connection.query(`INSERT INTO contact_persons("contact_person", "phone_number", "email", "company_id") VALUES(\$1, \$2, \$3, \$4) RETURNING id`, [contactPerson, phoneNumber, email, companyId])).rows[0].id;
        } catch (e) {
            logger.error(e);
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