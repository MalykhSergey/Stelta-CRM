import Company from "../../models/Company/Company"
import {getCompanies} from "@/models/Company/CompanyService"
import ClientCompanies from "./ClientPage"
import {Metadata} from "next";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Организации',
}
export default async function ServerCompanies() {
    const companies = await getCompanies() as Company[]
    return (
        <ClientCompanies companiesProps={companies}/>
    )
}