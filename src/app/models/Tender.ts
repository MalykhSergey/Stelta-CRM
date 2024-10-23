import { makeAutoObservable } from "mobx"
import { Result } from "../Result"

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
    public comments: string[]
  ) {
    if (comments.length == 0) {
      for (let i = 0; i < 6; i++)
        this.comments.push('')
    }
    makeAutoObservable(this)
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
}  