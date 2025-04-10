import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson"
import {makeAutoObservable} from "mobx"
import {Result} from "../../app/Result"
import Company from "../Company/Company"
import {DocumentRequest} from "./DocumentRequest"
import FileName from "./FileName"
import {RebiddingPrice} from "./RebiddingPrice"

export class Tender {
    public id: number = 0
    public status: number = 0
    public isSpecial: boolean = false
    public company: Company = new Company(0, '');
    public name: string = ''
    public shortName: string = ''
    public regNumber: string = ''
    public lotNumber: string = ''
    public initialMaxPrice: string = ''
    public price: string = ''
    public date1_start = ''
    public date1_finish = ''
    public date2_finish = ''
    public date_finish = ''
    // Используется в разделе поиска, для поиска по всем датам тендера (левая граница).
    public startDateRange = 0
    // Используется в разделе поиска, для поиска по всем датам тендера (правая граница).
    // Нужен, чтобы если указана дата для следующего этапа, то тендер не выпадал при поиске.
    // Пример. Тендер на этапе подготовки заявки, но уже известна дата начала и окончания (дата сл. этапа).
    public endDateRange = 0
    // Используется в разделе торги, для поиска по отображаемым датам.
    public statusDate = 0
    public contractDate = ''
    public contractNumber = ''
    public contactPerson: ContactPerson = new ContactPerson(0, '', '', '')
    public comments: string[] = ['', '', '', '', '', '']
    public stagedFileNames: FileName[][] = [[], [], [], [], [], [], []]
    public rebiddingPrices: RebiddingPrice[] = []
    public documentRequests: DocumentRequest[] = []

    constructor() {
    }

    public get isValid(): boolean {
        return this.name != '' && this.regNumber != '' && this.lotNumber != '' && this.initialMaxPrice != '' && this.price != '' && this.date1_start != '' && this.date1_finish != '' && this.date2_finish != '' && this.date_finish != '' && this.contactPerson.phoneNumber != '' && this.contactPerson.email != '' && this.contractNumber != '' && this.contractDate != '' && this.contactPerson.isValid()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromQueryRow(row: any) {
        const tender = new Tender()
        tender.id = row.id
        tender.status = row.status
        tender.isSpecial = row.is_special
        if (row.company_id) {
            tender.company.id = row.company_id
            tender.company.name = row.company_name
        }
        tender.name = row.name
        tender.shortName = row.short_name
        tender.lotNumber = row.lot_number
        tender.regNumber = row.register_number
        tender.initialMaxPrice = row.initial_max_price
        tender.price = row.price
        tender.date1_start = row.date1_start
        tender.contractNumber = row.contract_number
        tender.contractDate = row.contract_date
        tender.date1_finish = row.date1_finish
        tender.date2_finish = row.date2_finish
        tender.date_finish = row.date_finish
        tender.statusDate = tender.getStatusDate()
        tender.startDateRange = new Date(row.date1_start).getTime()
        const date1 = new Date(row.date1_finish).getTime()
        const date2 = new Date(row.date2_finish).getTime()
        const date3 = new Date(row.date_finish).getTime()
        const date4 = new Date(row.contract_date).getTime()
        tender.endDateRange = Math.max(date1, date2, date3, date4)
        for (let i = 0; i < 6; i++) {
            if (row[`comment${i}`] != null)
                tender.comments[i] = row[`comment${i}`]
        }
        return tender
    }

    static toJSON(tender: Tender) {
        return JSON.stringify(tender);
    }

    static fromJSON(data: string) {
        const obj = JSON.parse(data)
        const tender = new Tender()
        tender.id = obj.id
        tender.status = obj.status
        tender.isSpecial = obj.isSpecial
        const company = new Company(obj.company.id, obj.company.name)
        tender.company = makeAutoObservable(company)
        tender.name = obj.name
        tender.shortName = obj.shortName
        tender.regNumber = obj.regNumber
        tender.lotNumber = obj.lotNumber
        tender.initialMaxPrice = obj.initialMaxPrice
        tender.price = obj.price
        tender.date1_start = obj.date1_start
        tender.date1_finish = obj.date1_finish
        tender.date2_finish = obj.date2_finish
        tender.date_finish = obj.date_finish
        tender.startDateRange = obj.startDateRange
        tender.endDateRange = obj.endDateRange
        tender.statusDate = obj.statusDate
        tender.contractNumber = obj.contractNumber
        tender.contractDate = obj.contractDate
        tender.contactPerson = makeAutoObservable(new ContactPerson(obj.contactPerson.id, obj.contactPerson.name, obj.contactPerson.phoneNumber, obj.contactPerson.email))
        tender.comments = obj.comments
        tender.stagedFileNames = obj.stagedFileNames
        tender.rebiddingPrices = obj.rebiddingPrices.map((value: {
            id: number;
            price: string;
            fileNames: FileName[]
        }) => makeAutoObservable(new RebiddingPrice(value.id, value.price, value.fileNames)))
        tender.documentRequests = obj.documentRequests.map((value: {
            id: number;
            date: string;
            fileNames: FileName[]
        }) => makeAutoObservable(new DocumentRequest(value.id, value.date, value.fileNames)))
        return makeAutoObservable(tender)
    }

    setStatus(value: string): Result<string, string> {
        this.status = Number.parseInt(value)
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    toggleIsSpecial() {
        this.isSpecial = !this.isSpecial
    }

    setCompany(value: Company) {
        this.company = value
    }

    setName(value: string): Result<string, string> {
        this.name = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setShortName(value: string): Result<string, string> {
        this.shortName = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setRegNumber(value: string): Result<string, string> {
        this.regNumber = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setLotNumber(value: string): Result<string, string> {
        this.lotNumber = value
        return {ok: true, value: ''}
    }

    setInitialMaxPrice(value: string): Result<string, string> {
        this.initialMaxPrice = value.replace(',', '.')
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setPrice(value: string): Result<string, string> {
        this.price = value.replace(',', '.')
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setDate1_start(value: string) {
        this.date1_start = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setDate1_finish(value: string) {
        this.date1_finish = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setDate2_finish(value: string) {
        this.date2_finish = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setDate_finish(value: string) {
        this.date_finish = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setContactPerson(value: ContactPerson) {
        this.contactPerson = value
    }

    setContractNumber(value: string): Result<string, string> {
        this.contractNumber = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    setContractDate(value: string): Result<string, string> {
        this.contractDate = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    public removeFileFromStagedFileNames(fileName: FileName, arrayIndex: number): void {
        const index = this.stagedFileNames[arrayIndex].findIndex(item => item.name === fileName.name);
        if (index > -1)
            this.stagedFileNames[arrayIndex].splice(index, 1);
    }

    public deleteDocumentRequest(documentRequest: DocumentRequest): void {
        const index = this.documentRequests.findIndex(item => item.id == documentRequest.id);
        if (index > -1)
            this.documentRequests.splice(index, 1);
    }

    public deleteRebiddingPrice(rebiddingPrice: RebiddingPrice): void {
        const index = this.rebiddingPrices.findIndex(item => item.id == rebiddingPrice.id);
        if (index > -1)
            this.rebiddingPrices.splice(index, 1);
    }

    public addToStagedFileNames(fileName: FileName, arrayIndex: number): void {
        this.stagedFileNames[arrayIndex].push(fileName);
    }

    public isEditable(isAuth: boolean) {
        let isEditable = {
            status: isAuth,
            isSpecial: false,
            company: false,
            name: false,
            shortName: isAuth,
            regNumber: false,
            lotNumber: false,
            initialMaxPrice: false,
            price: false,
            date1_start: false,
            date1_finish: false,
            date2_finish: false,
            date_finish: false,
            contactPerson: false,
            phoneNumber: false,
            email: false,
        };
        if (isAuth) {
            if (this.status == 0) isEditable = {
                status: true,
                isSpecial: true,
                company: true,
                name: true,
                shortName: true,
                regNumber: true,
                lotNumber: true,
                initialMaxPrice: true,
                price: true,
                date1_start: true,
                date1_finish: true,
                date2_finish: true,
                date_finish: true,
                contactPerson: true,
                phoneNumber: true,
                email: true,
            };
            if (this.status <= 2) isEditable.date1_finish = true
            if (this.status <= 3) isEditable.date2_finish = true
            if (this.status <= 4) isEditable.date_finish = true
        }
        return isEditable;
    }

    public getStatusDate() {
        switch (Math.abs(this.status)) {
            case 1:
                return new Date(this.date1_start).getTime()
            case 2:
                return new Date(this.date1_finish).getTime()
            case 3:
                return new Date(this.date2_finish).getTime()
            case 4:
                return new Date(this.date2_finish).getTime()
            case 5:
                return new Date(this.date_finish).getTime()
            case 6:
                return new Date(this.contractDate).getTime()
            default:
                return 0
        }
    }
}  