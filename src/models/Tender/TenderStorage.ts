import fs from 'fs/promises';
import connection, {handleDatabaseError} from "../../config/Database";
import {Tender} from "./Tender";
import UPDATE_TENDER_QUERY from '../querries/UPDATE_TENDER';
import logger from "@/config/Logger";

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
            return {error: "Ошибка создания организации. Возможно такая уже есть!"}
        }
    }

    async createTender() {
        try {
            return (await connection.query(`INSERT into tenders DEFAULT VALUES RETURNING ID`)).rows[0].id
        } catch (e) {
            return handleDatabaseError(e,
                {'23505': 'Пустой тендер уже существует. Заполните поля Реестровый номер и Лот №!',},
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
            tender.price = tender.price.replace(',', '.')
            tender.initialMaxPrice = tender.initialMaxPrice.replace(',', '.')
            await connection.query(UPDATE_TENDER_QUERY, [
                tender.status,
                tender.isSpecial,
                tender.company.id ? tender.company.id : null,
                tender.name,
                tender.lotNumber,
                tender.regNumber,
                tender.initialMaxPrice,
                tender.price,
                tender.contactPerson,
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
            for (const dateRequest of tender.datesRequests) {
                await connection.query("UPDATE dates_requests SET date = $2 WHERE id =  $1", [dateRequest.id, dateRequest.date])
            }
            for (const rebiddingPrice of tender.rebiddingPrices) {
                rebiddingPrice.price = rebiddingPrice.price.replace(',', '.')
                await connection.query("UPDATE rebidding_prices SET price = $2 WHERE id =  $1", [rebiddingPrice.id, rebiddingPrice.price])
            }
        } catch (e) {
            return handleDatabaseError(e,
                {'23505': 'Ошибка обновления тендера: одно из полей нарушает уникальность!',},
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
        for (let i = 0; i < 6; i++) {
            tender.stagedFileNames[i] = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND rebidding_price_id is NULL AND date_request_id is NULL AND stage = $2', [id, i])).rows
        }
        const datesRequests = (await connection.query('SELECT *, CAST(date AS CHAR(10)) FROM dates_requests WHERE tender_id = $1 ORDER BY id', [id])).rows
        tender.datesRequests = (await Promise.all(datesRequests.map(async dateRequest => {
            dateRequest.fileNames = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND date_request_id = $2', [id, dateRequest.id])).rows
            return dateRequest
        })))
        const rebiddingPrices = (await connection.query('SELECT * FROM rebidding_prices WHERE tender_id = $1', [id])).rows
        tender.rebiddingPrices = (await Promise.all(rebiddingPrices.map(async rebiddingPrice => {
            rebiddingPrice.fileNames = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND rebidding_price_id =$2', [id, rebiddingPrice.id])).rows
            return rebiddingPrice
        })))
        return tender
    }

    async addFile(tenderId: number, fileName: string, stage: number, dateRequestId?: string | undefined, rebiddingPriceId?: string | undefined) {
        try {
            if (dateRequestId)
                return (await connection.query('INSERT INTO file_names(tender_id, "name", stage, date_request_id) VALUES ($1,$2,$3,$4) RETURNING id', [tenderId, fileName, stage, dateRequestId])).rows[0].id;
            else if (rebiddingPriceId)
                return (await connection.query('INSERT INTO file_names(tender_id, "name", stage, rebidding_price_id) VALUES ($1,$2,$3,$4) RETURNING id', [tenderId, fileName, stage, rebiddingPriceId])).rows[0].id;
            else
                return (await connection.query('INSERT INTO file_names(tender_id, "name", stage) VALUES ($1,$2,$3) RETURNING id', [tenderId, fileName, stage])).rows[0].id;
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка добавления файла!');
        }
    }

    async deleteFile(id: number) {
        try {
            await connection.query('DELETE FROM file_names WHERE id = $1', [id]);
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления файла!');
        }
    }

    async addDateRequest(tenderId: number) {
        try {
            return (await connection.query('INSERT INTO dates_requests(tender_id) VALUES ($1) RETURNING id', [tenderId])).rows[0].id
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

    async deleteDateRequest(tenderId: number, dateRequestId: number) {
        try {
            const filesId = (await connection.query('DELETE FROM file_names WHERE date_request_id = $1 returning id', [dateRequestId])).rows
            await connection.query('DELETE FROM dates_requests WHERE id = $1', [dateRequestId])
            for (const row of filesId) {
                await fs.rmdir(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${row.id}`, {recursive: true})
            }
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления дозапроса документов!');
        }
    }

    async deleteRebiddingPrice(tenderId: number, rebiddingPriceId: number) {
        try {
            const filesId = (await connection.query('DELETE FROM file_names WHERE rebidding_price_id = $1 returning id', [rebiddingPriceId])).rows
            await connection.query('DELETE FROM rebidding_prices WHERE id = $1', [rebiddingPriceId])
            for (const row of filesId) {
                await fs.rmdir(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${row.id}`, {recursive: true})
            }
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления переторжки!');
        }
    }

}

const tenderStorage = new TenderStorage();
export default tenderStorage;