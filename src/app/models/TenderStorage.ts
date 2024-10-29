import connection from "./Database";
import { Tender } from "./Tender";

class TenderStorage {
    constructor() {
        console.log('Created Tender storage')
    }

    async create() {
        return (await connection.query(`INSERT into tenders DEFAULT VALUES RETURNING ID`)).rows[0].id
    }

    async update(tender: Tender) {
        await connection.query(`
            UPDATE tenders 
            SET status = $1,
                company = $2,
                name = $3,
                lot_number = $4,
                register_number = $5,
                initial_max_price = $6,
                price = $7,
                contact_person = $8,
                phone_number = $9,
                email = $10,
                date1_start = $11,
                date1_finish = $12,
                date2_finish = $13,
                comment0 = $14,
                comment1 = $15,
                comment2 = $16,
                comment3 = $17,
                comment4 = $18,
                comment5 = $19
            WHERE id = $20
            `, [
            tender.status,
            tender.company,
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
            tender.comments[0],
            tender.comments[1],
            tender.comments[2],
            tender.comments[3],
            tender.comments[4],
            tender.comments[5],
            tender.id
        ])
        for (const dateRequest of tender.datesRequests) {
            if (dateRequest.id == 0) {
                await connection.query("INSERT INTO dates_requests(tender_id, date) VALUES ($1, now())", [tender.id])
            }
            else await connection.query("UPDATE dates_requests SET date = $2 WHERE id =  $1", [dateRequest.id, dateRequest.date])
        }
    }

    async getAll(): Promise<Tender[]> {
        const tenders_rows = (await connection.query('SELECT *, CAST(date1_start AS VARCHAR), CAST(date1_finish AS VARCHAR), CAST(date2_finish AS VARCHAR) FROM tenders')).rows;
        return tenders_rows.map(tender => Tender.fromQueryRow(tender))
    }
    async getById(id: number): Promise<Tender> {
        const tenders_row = (await connection.query('SELECT *, CAST(date1_start AS VARCHAR), CAST(date1_finish AS VARCHAR), CAST(date2_finish AS VARCHAR) FROM tenders WHERE id = $1', [id])).rows
        const tender = Tender.fromQueryRow(tenders_row[0])
        for (let i = 0; i < 6; i++) {
            const stage_files = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND rebidding_price_id is NULL AND date_request_id is NULL AND stage = $2', [id, i])).rows
            tender.stagedFileNames[i] = stage_files
        }
        const datesRequests = (await connection.query('SELECT *, CAST(date AS VARCHAR) FROM dates_requests WHERE tender_id = $1 ORDER BY id', [id])).rows
        tender.datesRequests = (await Promise.all(datesRequests.map(async dateRequest => {
            dateRequest.fileNames = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND date_request_id = $2', [id, dateRequest.id])).rows
            return dateRequest
        })))
        const rebiddingPrices = (await connection.query('SELECT * FROM rebidding_prices WHERE tender_id = $1', [id])).rows
        tender.rebiddingPrices = (await Promise.all(rebiddingPrices.map(async rebiddingPrice => {
            rebiddingPrice.price = rebiddingPrice.price.slice(0,-2)
            rebiddingPrice.fileNames = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND rebidding_price_id =$2', [id, rebiddingPrice.id])).rows
            return rebiddingPrice
        })))
        return tender
    }
    async addFile(tenderId: number, fileName: string, stage: number, dateRequestId?: string | undefined, rebiddingPriceId?: string | undefined) {
        if (dateRequestId)
            return (await connection.query('INSERT INTO file_names(tender_id, "name", stage, date_request_id) VALUES ($1,$2,$3,$4) RETURNING id', [tenderId, fileName, stage, dateRequestId])).rows[0].id;
        else if (rebiddingPriceId)
            return (await connection.query('INSERT INTO file_names(tender_id, "name", stage, rebidding_price_id) VALUES ($1,$2,$3,$4) RETURNING id', [tenderId, fileName, stage, rebiddingPriceId])).rows[0].id;
        else
            return (await connection.query('INSERT INTO file_names(tender_id, "name", stage) VALUES ($1,$2,$3) RETURNING id', [tenderId, fileName, stage])).rows[0].id;
    }
    async deleteFile(id: number) {
        await connection.query('DELETE FROM file_names WHERE id = $1', [id]);
    }

    async addDateRequest(tenderId: number) {
        return (await connection.query('INSERT INTO dates_requests(tender_id) VALUES ($1) RETURNING id', [tenderId])).rows[0].id
    }
    async addRebiddingPrice(tenderId: number) {
        return (await connection.query('INSERT INTO rebidding_prices(tender_id) VALUES ($1) RETURNING id', [tenderId])).rows[0].id
    }

}
const tenderStorage = new TenderStorage();
export default tenderStorage;