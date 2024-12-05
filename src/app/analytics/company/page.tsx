import {getCompanies} from "@/models/Company/CompanyService";
import CompanyAnalyticsClient from "./ClientPage";
import {getStatusAnalyticsByCompany} from "@/models/Analytics/AnalyticsService";

export const dynamic = 'force-dynamic'
export default async function CompanyAnalyticsServer() {
    const companies = await getCompanies();
    const initialData = await getStatusAnalyticsByCompany(companies[0].id)
    return (
        <CompanyAnalyticsClient companies={companies} initialData={initialData}/>
    )
}