import { getCompanies } from "@/app/models/CompanyService";
import CompanyAnalyticsClient from "./ClientPage";
import { getStatusAnalyticsByCompany } from "@/app/models/Analytics/AnalyticsService";

export default async function CompanyAnalyticsServer() {
  const companies = await getCompanies();
  const initialData = await getStatusAnalyticsByCompany(companies[0].id)
  return (
    <CompanyAnalyticsClient companies={companies} initialData={initialData}/>
  )
}