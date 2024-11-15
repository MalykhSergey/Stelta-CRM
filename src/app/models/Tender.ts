import { makeAutoObservable } from "mobx"
import { Result } from "../Result"
import { DateRequest } from "./DateRequest"
import FileName from "./FileName"
import { RebiddingPrice } from "./RebiddingPrice"
import Company from "./Company"

export class Tender {
  public id: number = 0
  public status: number = 0
  public isSpecial: boolean = false
  public company: Company = new Company(0,'');
  public name: string = ''
  public regNumber: string = ''
  public lotNumber: string = ''
  public initialMaxPrice: string = ''
  public price: string = ''
  public date1_start = ''
  public date1_finish = ''
  public date2_finish = ''
  public contractDate = ''
  public contractNumber = ''
  public contactPerson: string = ''
  public phoneNumber: string = ''
  public email: string = ''
  public comments: string[] = ['', '', '', '', '', '']
  public stagedFileNames: FileName[][] = [[], [], [], [], [], [], []]
  public rebiddingPrices: RebiddingPrice[] = []
  public datesRequests: DateRequest[] = []
  constructor() { }
  setStatus(value: string): Result<string, string> {
    this.status = Number.parseInt(value)
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  toggleIsSpecial(){
    this.isSpecial = !this.isSpecial
  }
  setCompany(value: number): Result<string, string> {
    this.company.id = value
    return { ok: true, value: '' }
  }
  setName(value: string): Result<string, string> {
    this.name = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setRegNumber(value: string): Result<string, string> {
    this.regNumber = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setLotNumber(value: string): Result<string, string> {
    this.lotNumber = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setInitialMaxPrice(value: string): Result<string, string> {
    this.initialMaxPrice = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setPrice(value: string): Result<string, string> {
    this.price = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setDate1_start(value: string) {
    this.date1_start = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setDate1_finish(value: string) {
    this.date1_finish = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setDate2_finish(value: string) {
    this.date2_finish = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setContactPerson(value: string): Result<string, string> {
    this.contactPerson = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setPhoneNumber(value: string): Result<string, string> {
    this.phoneNumber = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setEmail(value: string): Result<string, string> {
    this.email = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    if (!this.email.includes('@')) {
      return { ok: false, error: 'Email не содержит @!' }
    }
    return { ok: true, value: '' }
  }
  setContractNumber(value: string): Result<string, string> {
    this.contractNumber = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setContractDate(value: string): Result<string, string> {
    this.contractDate = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromQueryRow(row: any) {
    const tender = new Tender()
    tender.id = row.id
    tender.status = row.status
    tender.isSpecial = row.is_special
    tender.company.id = row.company_id
    tender.company.name = row.company_name
    tender.name = row.name
    tender.lotNumber = row.lot_number
    tender.regNumber = row.register_number
    tender.initialMaxPrice = row.initial_max_price.slice(0, -2)
    tender.price = row.price.slice(0, -2)
    tender.contactPerson = row.contact_person
    tender.phoneNumber = row.phone_number
    tender.email = row.email
    tender.date1_start = row.date1_start
    tender.contractNumber = row.contract_number
    tender.contractDate = row.contract_date
    tender.date1_finish = row.date1_finish
    tender.date2_finish = row.date2_finish
    for (let i = 0; i < 6; i++) {
      if (row[`comment${i}`] != null)
        tender.comments[i] = row[`comment${i}`]
    }
    return tender
  }
  public removeFileFromStagedFileNames(fileName: FileName, arrayIndex: number): void {
    const index = this.stagedFileNames[arrayIndex].findIndex(item => item.name === fileName.name);
    if (index > -1)
      this.stagedFileNames[arrayIndex].splice(index, 1);
  }
  public deleteDateRequest(dateRequest: DateRequest): void {
    const index = this.datesRequests.findIndex(item => item.id == dateRequest.id);
    if (index > -1)
      this.datesRequests.splice(index, 1);
  }
  public deleteRebiddingPrice(rebiddingPrice: RebiddingPrice): void {
    const index = this.rebiddingPrices.findIndex(item => item.id == rebiddingPrice.id);
    if (index > -1)
      this.rebiddingPrices.splice(index, 1);
  }
  public addToStagedFileNames(fileName: FileName, arrayIndex: number): void {
    this.stagedFileNames[arrayIndex].push(fileName);
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
    tender.company = obj.company
    tender.name = obj.name
    tender.regNumber = obj.regNumber
    tender.lotNumber = obj.lotNumber
    tender.initialMaxPrice = obj.initialMaxPrice
    tender.price = obj.price
    tender.date1_start = obj.date1_start
    tender.date1_finish = obj.date1_finish
    tender.date2_finish = obj.date2_finish
    tender.contractNumber = obj.contractNumber
    tender.contractDate = obj.contractDate
    tender.contactPerson = obj.contactPerson
    tender.phoneNumber = obj.phoneNumber
    tender.email = obj.email
    tender.comments = obj.comments
    tender.stagedFileNames = obj.stagedFileNames
    tender.rebiddingPrices = obj.rebiddingPrices.map((value: { id: number; price: string; fileNames: FileName[] }) => makeAutoObservable(new RebiddingPrice(value.id, value.price, value.fileNames)))
    tender.datesRequests = obj.datesRequests.map((value: { id: number; date: string; fileNames: FileName[] }) => makeAutoObservable(new DateRequest(value.id, value.date, value.fileNames)))
    return makeAutoObservable(tender)
  }
}  