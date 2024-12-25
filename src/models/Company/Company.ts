import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";

export default class Company {
    id: number = 0
    name = ''
    contactPersons = [] as ContactPerson[]

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
    addContactPerson(contactPerson: ContactPerson) {
        this.contactPersons.push(contactPerson)
    }

    static fromJSONArray(array: string) {
        return JSON.parse(array).map((value: Company) => {
            value.contactPersons = value.contactPersons.map((contactPerson: ContactPerson) => {
                return new ContactPerson(contactPerson.id, contactPerson.name, contactPerson.phoneNumber, contactPerson.email)
            })
            return value
        })
    }
}