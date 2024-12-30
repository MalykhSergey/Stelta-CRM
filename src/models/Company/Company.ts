import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {makeAutoObservable} from "mobx";


export interface ICompany {
    id: number;
    name: string;
    contactPersons: ContactPerson[];
}

export default class Company implements ICompany {
    id: number = 0;
    name = '';
    contactPersons = [] as ContactPerson[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJSONArray(array: string) {
        return JSON.parse(array).map((value: Company) => {
            value.contactPersons = value.contactPersons.map((contactPerson: ContactPerson) => {
                return makeAutoObservable(new ContactPerson(contactPerson.id, contactPerson.name, contactPerson.phoneNumber, contactPerson.email))
            })
            return makeAutoObservable(value)
        })
    }

    addContactPerson(contactPerson: ContactPerson) {
        this.contactPersons.push(contactPerson)
    }
}