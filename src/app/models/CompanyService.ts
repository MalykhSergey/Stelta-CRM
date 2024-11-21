import tenderStorage from "./TenderStorage";

export async function getCompanies() {
    return await tenderStorage.getCompanies();
}
export async function createCompany(name: string) {
    return await tenderStorage.createCompany(name);
}