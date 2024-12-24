import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";

export default class Company {
    id: number = 0
    name = ''
    contactPersons = [] as ContactPerson[]

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    static fromJSONArray(array: string) {
        return JSON.parse(array).map(value => {
            value.contactPersons = value.contactPersons.map(contactPerson => {
                return new ContactPerson(contactPerson._id, contactPerson._name, contactPerson._phoneNumber, contactPerson._email)
            })
            if(value.id == 91)
                console.log(value)
            return value
        })
    }
}