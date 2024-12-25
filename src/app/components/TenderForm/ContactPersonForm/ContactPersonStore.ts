import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import Company from "@/models/Company/Company";
import {makeAutoObservable} from "mobx";

export class ContactPersonStore {
    constructor(company: Company, contactPerson: ContactPerson) {
        this._company = company;
        this._contactPerson = contactPerson;
        this.searchResults = this._company.contactPersons
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

    private _searchResults: ContactPerson[] = []

    get searchResults(): ContactPerson[] {
        return this._searchResults;
    }

    set searchResults(value: ContactPerson[]) {
        this._searchResults = value
    }

    findMatches(name: string) {
        const searchString = name.toLowerCase();
        this.searchResults = this.company.contactPersons.filter(contactPerson => contactPerson.name.toLowerCase().includes(searchString))
    }

    get isNew() {
        return this.company.contactPersons.filter(contactPerson => contactPerson.isEquals(this.contactPerson)).length < 1
    }
}
