import {getCompanyAnalyticsByStatus} from "@/models/Old_Analytics/AnalyticsService";
import StatusAnalyticsClient from "@/app/old_analytics/status/ClientPage";
import {CompanyAnalytics} from "@/models/Old_Analytics/CompanyAnalytics";
import {Metadata} from "next";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Аналитика по статусу',
}
export default async function StatusAnalyticsServer() {
    const analytics_data = await getCompanyAnalyticsByStatus(6) as CompanyAnalytics[]
    return (
        <>
            <StatusAnalyticsClient initialData={analytics_data}/>
        </>
    )
}