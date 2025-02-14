import Company from "@/models/Company/Company";
import { ContactPerson } from "@/models/Company/ContactPerson/ContactPerson";
import { makeAutoObservable } from "mobx";

export class ContactPersonStore {
    constructor(company: Company, contactPerson: ContactPerson) {
        this._company = company;
        this._contactPerson = contactPerson;
        makeAutoObservable(this)
    }

    private _company: Company

    get company(): Company {
        return this._company;
    }

    set company(value: Company) {
        this._company = value;
    }

    private _contactPerson: ContactPerson

    get contactPerson(): ContactPerson {
        return this._contactPerson;
    }

    set contactPerson(value: ContactPerson) {
        this._contactPerson = value;
    }


    get searchResults() {
        const searchString = this.contactPerson.name.toLowerCase();
        return this.company.contactPersons.filter(contactPerson => contactPerson.name.toLowerCase().includes(searchString))
    }

    get isNew() {
        for (const contactPerson of this.company.contactPersons) {
            if (contactPerson.isEquals(this.contactPerson))
                return false
        }
        return true;
    }

    checkOnNew() {
        for (const contactPerson of this.company.contactPersons) {
            if (contactPerson.isEquals(this.contactPerson)) {
                this.contactPerson.id = contactPerson.id
                return
            }
        }
        this.contactPerson.id = 0
    }
}
