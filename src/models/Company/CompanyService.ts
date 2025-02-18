"use server"
import logger from "@/config/Logger";
import CompanyStorage from "@/models/Company/CompanyStorage";
import { User } from "@/models/User/User";
import { authAction } from "../User/UserService";
import { ICompany } from "./Company";

export async function getCompaniesWithPersons() {
    return JSON.stringify(await CompanyStorage.getCompaniesWithPersons());
}

export async function getCompanies() {
    return await CompanyStorage.getCompanies();
}

export async function createCompany(name: string) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} create company ${name}`);
        return await CompanyStorage.createCompany(name)
    });
}

export async function updateCompany(company: ICompany) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} update company ${company.name}`);
        return await CompanyStorage.updateCompany(company.id, company.name)
    });
}

export async function deleteCompany(id: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete company`);
        return await CompanyStorage.deleteCompany(id)
    });
}