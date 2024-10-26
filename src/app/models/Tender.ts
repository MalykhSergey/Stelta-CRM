import { makeAutoObservable } from "mobx"
import { Result } from "../Result"
import { RebiddingPrice } from "./RebiddingPrice"
import { DatesRequests } from "./DatesRequests"

export class Tender {
  constructor(
    public id: number,
    public status: number,
    public company: string,
    public name: string,
    public regNumber: string,
    public lotNumber: string,
    public initialMaxPrice: string,
    public price: string,
    public dates: string[2][2],
    public contactPerson: string,
    public phoneNumber: string,
    public email: string,
    public comments: string[],
    public fileNames: string[],
    private rebiddingPrices: RebiddingPrice[],
    private datesRequests: DatesRequests[],
  ) {
    if (comments.length == 0) {
      for (let i = 0; i < 6; i++)
        this.comments.push('')
    }
  }
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
  static getEmpty() {
    return new Tender(2,
      3,
      "TEST",
      "TEST",
      "TEST",
      "LOT-003",
      '2000',
      '1800',
      [["2021-03-01", "2021-03-15"]],
      "Alice Johnson",
      "456789123",
      "alice.johnson@example.com",
      [],
      []
    );
  }
  static toPlainObject(tender: Tender) {
    return { ...tender };
  }
  static fromPlainObject(obj: any): Tender {
    return new Tender(
      obj.id,
      obj.status,
      obj.company,
      obj.name,
      obj.regNumber,
      obj.lotNumber,
      obj.initialMaxPrice,
      obj.price,
      obj.dates,
      obj.contactPerson,
      obj.phoneNumber,
      obj.email,
      obj.comments,
      obj.fileNames
    );
  }
}  