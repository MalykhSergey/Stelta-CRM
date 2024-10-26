import { Result } from "../Result"
import { DatesRequests } from "./DateRequest"
import FileName from "./FileName"
import { RebiddingPrice } from "./RebiddingPrice"

export class Tender {
  public id: number = 0
  public status: number = 0
  public company: string = ''
  public name: string = ''
  public regNumber: string = ''
  public lotNumber: string = ''
  public initialMaxPrice: string = ''
  public price: string = ''
  public date1_start = ''
  public date1_finish = ''
  public date2_finish = ''
  public contactPerson: string = ''
  public phoneNumber: string = ''
  public email: string = ''
  public comments: string[] = ['','','','','','']
  public fileNames: FileName[] = []
  public rebiddingPrices: RebiddingPrice[] = []
  public datesRequests: DatesRequests[] = []
  constructor() {}
  setStatus(value: string): Result<string, string> {
    this.status = Number.parseInt(value)
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
    return { ok: true, value: '' }
  }
  setCompany(value: string): Result<string, string> {
    this.company = value
    if (value == "") {
      return { ok: false, error: 'Поле не должно быть пустым!' }
    }
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
  static toPlainObject(tender: Tender) {
    return { ...tender };
  }
  static fromPlainObject(obj: any): Tender {
    let tender = new Tender()
    tender.id = obj.id,
      tender.status = obj.status,
      tender.company = obj.company,
      tender.name = obj.name,
      tender.regNumber = obj.regNumber,
      tender.lotNumber = obj.lotNumber,
      tender.initialMaxPrice = obj.initialMaxPrice,
      tender.price = obj.price,
      tender.date1_start = obj.date1_start,
      tender.date1_finish = obj.date1_finish,
      tender.date2_finish = obj.date2_finish,
      tender.contactPerson = obj.contactPerson,
      tender.phoneNumber = obj.phoneNumber,
      tender.email = obj.email,
      tender.comments = obj.comments,
      tender.fileNames = obj.fileNames
    return tender
  }
}  