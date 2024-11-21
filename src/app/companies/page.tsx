import Company from "../models/Company"
import { getCompanies } from "../models/CompanyService"
import ClientCompanies from "./ClientPage"
export default async function ServerCompanies() {
    const companies = await getCompanies() as Company[]
    return (
        <ClientCompanies companiesProps={companies} />
    )
}