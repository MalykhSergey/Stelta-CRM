"use server"
import {authAction} from "../User/UserService";
import CompanyStorage from "@/models/Company/CompanyStorage";
import {User} from "@/models/User/User";
import logger from "@/config/Logger";

export async function getCompaniesWithPersons() {
    return JSON.stringify(await CompanyStorage.getCompaniesWithPersons());
}

export async function getCompanies() {
    return await CompanyStorage.getCompanies();
}

export async function createCompany(name: string) {
    return authAction(async (user:User) => {
        logger.info(`${user.name} create company ${name}`);
        return await CompanyStorage.createCompany(name)
    });
}

export async function updateCompany(form: FormData) {
    return authAction(async (user:User) => {
        const name = form.get('name')
        logger.info(`${user.name} update company ${name}`);
        const id = form.get('id')
        if (id && name)
            return await CompanyStorage.updateCompany(Number.parseInt(id as string), name as string)
    });
}

export async function deleteCompany(id: number) {
    return authAction(async (user:User) => {
        logger.info(`${user.name} delete company`);
        return await CompanyStorage.deleteCompany(id)
    });
}