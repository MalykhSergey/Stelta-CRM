import { ContactPerson } from "@/models/Company/ContactPerson/ContactPerson";
import { makeAutoObservable } from "mobx";


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

    static fromJSONArray(array: string): Company[] {
        return JSON.parse(array).map((value: ICompany) => {
            const company = new Company(value.id, value.name)
            company.contactPersons = value.contactPersons.map((contactPerson: ContactPerson) => {
                return makeAutoObservable(new ContactPerson(contactPerson.id, contactPerson.name, contactPerson.phoneNumber, contactPerson.email))
            })
            return company
        })
    }

    addContactPerson(contactPerson: ContactPerson) {
        this.contactPersons.push(contactPerson)
    }
    
    serialize(simplify = false) {
        if (simplify){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {contactPersons,...data} = this
            return data
        }
        else
            return this
    }
}