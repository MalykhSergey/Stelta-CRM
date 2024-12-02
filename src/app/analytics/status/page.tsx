import {getCompanyAnalyticsByStatus} from "@/app/models/Analytics/AnalyticsService";
import StatusAnalyticsClient from "@/app/analytics/status/ClientPage";
import {CompanyAnalytics} from "@/app/models/Analytics/CompanyAnalytics";


export default async function StatusAnalyticsServer() {
    const analytics_data = await getCompanyAnalyticsByStatus(6) as CompanyAnalytics[]
    return (
        <>
            <StatusAnalyticsClient initialData={analytics_data}/>
        </>
    )
}