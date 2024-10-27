import connection from "./Database";
import { Tender } from "./Tender";

class TenderStorage {
    constructor() {
        console.log('Created Tender storage')
    }
    // add(tender: Tender) {
    //     // this.allTenders.push(tender)
    // }

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
    }

    async getAll(): Promise<Tender[]> {
        const tenders_rows = (await connection.query('SELECT * FROM tenders')).rows;
        return tenders_rows.map(tender => Tender.fromQueryRow(tender))
    }
    async getById(id: number): Promise<Tender> {
        const tenders_row = (await connection.query('SELECT * FROM tenders WHERE id = $1', [id])).rows
        const tender = Tender.fromQueryRow(tenders_row[0])
        for (let i = 0; i < 6; i++) {
            const stage_files = (await connection.query('SELECT * FROM file_names WHERE tender_id = $1 AND rebidding_price_id is NULL AND request_date_id is NULL AND stage = $2', [id, i])).rows
            tender.stagedFileNames[i] = stage_files
        }
        return tender
    }
    async addFile(tenderId: number, fileName: string, stage: number) {
        console.log('stage = ' + stage.toString())
        await connection.query('INSERT INTO file_names(tender_id, "name", stage) VALUES ($1,$2,$3)', [tenderId, fileName, stage]);
    }
    async deleteFile(id: number) {
        await connection.query('DELETE FROM file_names WHERE id = $1', [id]);
    }

}
const tenderStorage = new TenderStorage();
export default tenderStorage;