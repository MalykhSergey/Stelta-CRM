import logger from "@/config/Logger";
import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import fs from 'fs/promises';
import connection, { handleDatabaseError } from "../../config/Database";
import { ContactPerson } from '../Company/ContactPerson/ContactPerson';
import FileName, { FileType } from "./FileName";
import { Tender } from "./Tender";
import { console } from "inspector";

class TenderStorage {
    constructor() {
        logger.info('Created Tender storage')
    }

    async getCompanies() {
        return (await connection.query(`SELECT * FROM companies`)).rows
    }

    async createCompany(name: string) {
        try {
            return (await connection.query(`INSERT INTO companies("name") values($1) RETURNING id`, [name])).rows[0].id
        } catch (e) {
            logger.error(e)
            return { error: "Ошибка создания организации. Возможно такая уже есть!" }
        }
    }

    async createTender(status = 0) {
        try {
            return (await connection.query(`INSERT into tenders("status") values($1) RETURNING ID`, [status])).rows[0].id
        } catch (e) {
            return handleDatabaseError(e,
                { '23505': 'Пустой тендер уже существует. Заполните поля Реестровый номер и Лот №!', },
                'Ошибка создания тендера');
        }
    }

    async deleteTender(tenderId: number) {
        try {
            await connection.query(`DELETE FROM tenders WHERE id = $1`, [tenderId])
        } catch (e) {
            return handleDatabaseError(e, {
                '23503': 'Невозможно удалить тендер: имеются связанные данные (дозапросы, переторжки, файлы)!',
            }, 'Ошибка удаления тендера!');
        }
    }

    async update(tender: Tender) {
        try {
            if (tender.contactPerson.name != '') {
                if (tender.contactPerson.id != 0) {
                    const result = await ContactPersonStorage.updateContactPerson(tender.contactPerson.id, tender.contactPerson.name, tender.contactPerson.phoneNumber, tender.contactPerson.email)
                    if (result?.error)
                        return result
                }
                else {
                    const result = await ContactPersonStorage.createContactPerson(tender.contactPerson, tender.company.id)
                    if (result?.error)
                        return result
                    tender.contactPerson.id = result
                }
            }
            tender.price = tender.price.replace(',', '.')
            tender.initialMaxPrice = tender.initialMaxPrice.replace(',', '.')
            await connection.query(`
            UPDATE tenders 
            SET status = $1,
                is_special = $2,
                company_id = $3,
                name = $4,
                lot_number = $5,
                register_number = $6,
                initial_max_price = $7,
                price = $8,
                contact_person_id = $9,
                phone_number = $10,
                email = $11,
                date1_start = $12,
                date1_finish = $13,
                date2_finish = $14,
                date_finish = $15,
                contract_number = $16,
                contract_date = $17,
                comment0 = $18,
                comment1 = $19,
                comment2 = $20,
                comment3 = $21,
                comment4 = $22,
                comment5 = $23
            WHERE id = $24
            `, [
                tender.status,
                tender.isSpecial,
                tender.company.id ? tender.company.id : null,
                tender.name,
                tender.lotNumber,
                tender.regNumber,
                tender.initialMaxPrice,
                tender.price,
                tender.contactPerson.id ? tender.contactPerson.id : null,
                tender.phoneNumber,
                tender.email,
                tender.date1_start,
                tender.date1_finish,
                tender.date2_finish,
                tender.date_finish,
                tender.contractNumber,
                tender.contractDate,
                tender.comments[0],
                tender.comments[1],
                tender.comments[2],
                tender.comments[3],
                tender.comments[4],
                tender.comments[5],
                tender.id
            ])
            for (const documentRequest of tender.documentRequests) {
                await connection.query("UPDATE document_requests SET date = $2 WHERE id =  $1", [documentRequest.id, documentRequest.date])
            }
            for (const rebiddingPrice of tender.rebiddingPrices) {
                rebiddingPrice.price = rebiddingPrice.price.replace(',', '.')
                await connection.query("UPDATE rebidding_prices SET price = $2 WHERE id =  $1", [rebiddingPrice.id, rebiddingPrice.price])
            }
        } catch (e) {
            return handleDatabaseError(e,
                { '23505': 'Ошибка обновления тендера: одно из полей нарушает уникальность!', },
                'Ошибка обновления тендера');
        }
    }

    async getAll(): Promise<Tender[]> {
        const tenders_rows = (await connection.query(`
            SELECT tenders.*, CAST(date1_start AS CHAR(16)), CAST(date1_finish AS CHAR(16)), CAST(date2_finish AS CHAR(16)), CAST(date_finish AS CHAR(16)), CAST(contract_date AS CHAR(10)), companies.id AS company_id, companies.name AS company_name
            FROM tenders
            LEFT JOIN  companies ON companies.id = company_id
            ORDER BY tenders.id DESC`)).rows;
        return tenders_rows.map(tender => Tender.fromQueryRow(tender))
    }

    async getById(id: number): Promise<Tender> {
        const tenders_row = (await connection.query(`
            SELECT tenders.*, CAST(date1_start AS CHAR(16)), CAST(date1_finish AS CHAR(16)), CAST(date2_finish AS CHAR(16)), CAST(date_finish AS CHAR(16)), CAST(contract_date AS CHAR(10)), companies.id AS company_id, companies.name AS company_name
            FROM tenders
            LEFT JOIN  companies ON companies.id = company_id 
            WHERE tenders.id =  $1`, [id])).rows
        const tender = Tender.fromQueryRow(tenders_row[0])
        const contactPersons = await ContactPersonStorage.getContactPersonsByCompanyId(tender.company.id)
        if (!('error' in contactPersons)) {
            tender.company.contactPersons = contactPersons as ContactPerson[]
            const contactPerson = contactPersons.find(contactPerson => contactPerson.id == tenders_row[0].contact_person_id);
            if (contactPerson)
                tender.contactPerson = contactPerson as ContactPerson
        }
        for (let i = 0; i < 6; i++) {
            tender.stagedFileNames[i] = (await connection.query('SELECT * FROM tenders_files WHERE tender_id = $1 AND stage = $2', [id, i])).rows.map(row => {
                row.fileType = FileType.Tender
                row.tenderId = id
                return row
            })
        }
        const documentRequests = (await connection.query('SELECT *, CAST(date AS CHAR(10)) FROM document_requests WHERE tender_id = $1 ORDER BY id', [id])).rows
        tender.documentRequests = (await Promise.all(documentRequests.map(async documentRequest => {
            documentRequest.fileNames = (await connection.query('SELECT * FROM document_requests_files WHERE document_request_id = $1', [documentRequest.id])).rows.map(row => {
                row.fileType = FileType.DocumentRequest
                row.tenderId = id
                row.parentId = documentRequest.id
                return row
            })
            return documentRequest
        })))
        const rebiddingPrices = (await connection.query('SELECT * FROM rebidding_prices WHERE tender_id = $1', [id])).rows
        tender.rebiddingPrices = (await Promise.all(rebiddingPrices.map(async rebiddingPrice => {
            rebiddingPrice.fileNames = (await connection.query('SELECT * FROM rebidding_prices_files WHERE rebidding_price_id =$1', [rebiddingPrice.id])).rows.map(row => {
                row.fileType = FileType.RebiddingPrice
                row.tenderId = id
                row.parentId = rebiddingPrice.id
                return row
            })
            return rebiddingPrice
        })))
        return tender
    }

    async addFile(tenderId: number, fileName: string, stage: number, documentRequestId?: string | undefined, rebiddingPriceId?: string | undefined) {
        try {
            if (documentRequestId)
                return (await connection.query('INSERT INTO document_requests_files("name", document_request_id) VALUES ($1,$2) RETURNING id', [fileName, documentRequestId])).rows[0].id;
            else if (rebiddingPriceId)
                return (await connection.query('INSERT INTO rebidding_prices_files("name", rebidding_price_id) VALUES ($1,$2) RETURNING id', [fileName, rebiddingPriceId])).rows[0].id;
            else
                return (await connection.query('INSERT INTO tenders_files(tender_id, "name", stage) VALUES ($1,$2,$3) RETURNING id', [tenderId, fileName, stage])).rows[0].id;
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка добавления файла!');
        }
    }

    async deleteFile(fileName: FileName) {
        try {
            switch (fileName.fileType) {
                case FileType.Tender:
                    await connection.query('DELETE FROM tenders_files WHERE id = $1', [fileName.id]);
                    break;
                case FileType.RebiddingPrice:
                    await connection.query('DELETE FROM rebidding_prices_files WHERE id = $1', [fileName.id]);
                    break;
                case FileType.DocumentRequest:
                    await connection.query('DELETE FROM document_requests_files WHERE id = $1', [fileName.id]);
                    break;
            }
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления файла!');
        }
    }

    async addDocumentRequest(tenderId: number) {
        try {
            return (await connection.query('INSERT INTO document_requests(tender_id) VALUES ($1) RETURNING id', [tenderId])).rows[0].id
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка создания дозапроса документов!');
        }
    }

    async addRebiddingPrice(tenderId: number) {
        try {
            return (await connection.query('INSERT INTO rebidding_prices(tender_id) VALUES ($1) RETURNING id', [tenderId])).rows[0].id
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка создания переторжки!');
        }
    }

    async deleteDocumentRequest(tenderId: number, documentRequestId: number) {
        try {
            const filesId = (await connection.query('DELETE FROM document_requests_files WHERE document_request_id = $1 returning id', [documentRequestId])).rows
            await connection.query('DELETE FROM document_requests WHERE id = $1', [documentRequestId])
            await fs.rmdir(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${FileType.DocumentRequest}/${documentRequestId}`, { recursive: true })
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления дозапроса документов!');
        }
    }

    async deleteRebiddingPrice(tenderId: number, rebiddingPriceId: number) {
        try {
            const filesId = (await connection.query('DELETE FROM rebidding_prices_files WHERE rebidding_price_id = $1 returning id', [rebiddingPriceId])).rows
            await connection.query('DELETE FROM rebidding_prices WHERE id = $1', [rebiddingPriceId])
            await fs.rmdir(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${FileType.RebiddingPrice}/${rebiddingPriceId}`, { recursive: true })
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления переторжки!');
        }
    }

}

const tenderStorage = new TenderStorage();
export default tenderStorage;