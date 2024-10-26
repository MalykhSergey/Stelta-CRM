import { Tender } from "./Tender";

class TenderStorage {
    private allTenders = [] as Tender[]
    constructor() {
        const tender1 = new Tender();
        tender1.id = 0
        tender1.status = 3
        tender1.company = "Company A"
        tender1.name = "Tender 1"
        tender1.regNumber = "REG-001"
        tender1.lotNumber = "LOT-001"
        tender1.initialMaxPrice = '1000'
        tender1.price = '900'
        tender1.date1_start = "2021-01-01"
        tender1.date1_finish = "2021-01-01"
        tender1.date2_finish = "2021-01-01"
        tender1.contactPerson = "John Doe"
        tender1.phoneNumber = "123456789"
        tender1.email = "john.doe@example.com"
        tender1.comments = []
        tender1.fileNames = ["lab2.pdf", "lab2.pdf"]
        this.allTenders.push(tender1)
    }
    add(tender: Tender) {
        this.allTenders.push(tender)
    }

    getAll(): Tender[] {
        return this.allTenders
    }
    getById(id: number): Tender {
        return this.allTenders.filter(tender => tender.id == id)[0]
    }

}
const tenderStorage = new TenderStorage();
export default tenderStorage;