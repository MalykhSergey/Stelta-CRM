import { getCompaniesWithPersons } from "@/models/Company/CompanyService";
import { Metadata } from "next";
import ClientCompanies from "./ClientPage";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Организации',
}
export default async function ServerCompanies() {
    const companies = await getCompaniesWithPersons()
    return (
        <ClientCompanies companiesProps={companies}/>
    )
}