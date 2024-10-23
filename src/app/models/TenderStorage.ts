import { makeAutoObservable } from 'mobx';
import { Tender } from './Tender';


class TenderStorage {
    private allTenders = [] as Tender[]
    constructor() {
        console.log('init tender storage')
        makeAutoObservable(this);
        // for test

        const tender1 = new Tender(0,
            3,
            "Company A",
            "Tender 1",
            "REG-001",
            "LOT-001",
            '1000',
            '900',
            [["2021-01-01", "2021-01-15"]],
            "John Doe",
            "123456789",
            "john.doe@example.com",
            []
        );

        const tender2 = new Tender(1,
            2,
            "Company B",
            "Tender 2",
            "REG-002",
            "LOT-002",
            1500,
            1400,
            [["2021-02-01", "2021-02-15"]],
            "Jane Smith",
            "987654321",
            "jane.smith@example.com",
            []
        );
        const tender3 = new Tender(2,
            3,
            "Company C",
            "Tender 3",
            "REG-003",
            "LOT-003",
            '2000',
            '1800',
            [["2021-03-01", "2021-03-15"]],
            "Alice Johnson",
            "456789123",
            "alice.johnson@example.com",
            []
        );
        this.allTenders.push(tender1)
        this.allTenders.push(tender2)
        this.allTenders.push(tender3)
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

export const tenderStorage = new TenderStorage();
