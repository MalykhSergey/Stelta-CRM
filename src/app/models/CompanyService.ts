"use server"
import tenderStorage from "./TenderStorage";
import {authAction} from "./UserService";

export async function getCompanies() {
    return await tenderStorage.getCompanies();
}

export async function createCompany(name: string) {
    return authAction(async () => {
        return await tenderStorage.createCompany(name)
    });
}