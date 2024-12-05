"use server"
import tenderStorage from "../Tender/TenderStorage";
import {authAction} from "../UserService";
import CompanyStorage from "@/models/Company/CompanyStorage";

export async function getCompanies() {
    return await CompanyStorage.getCompanies();
}

export async function createCompany(name: string) {
    return authAction(async () => {
        return await tenderStorage.createCompany(name)
    });
}

export async function updateCompany(form: FormData) {
    return authAction(async () => {
        const name = form.get('name')
        const id = form.get('id')
        if (id && name)
            return await CompanyStorage.updateCompany(Number.parseInt(id as string), name as string)
    });
}

export async function deleteCompany(id: number) {
    return authAction(async () => {
        return await CompanyStorage.deleteCompany(id)
    });
}