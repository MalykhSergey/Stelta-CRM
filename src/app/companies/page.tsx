import tenderStorage from "../models/TenderStorage"
import ClientCompanies from "./ClientPage"
export default async function ServerCompanies() {
    const companies = await tenderStorage.getCompanies() as [{ id: number, name: string }]
    return (
        <ClientCompanies companiesProps={companies} />
    )
}