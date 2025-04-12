import {getCommonAnalytics} from "@/models/Old_Analytics/AnalyticsService";
import CommonAnalyticsClient from "@/app/old_analytics/common/ClientPage";
import {CommonAnalytics} from "@/models/Old_Analytics/CommonAnalytics";
import {Metadata} from "next";


export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Общая аналитика',
}
export default async function CommonAnalyticsServer() {
    const analytics_data = await getCommonAnalytics() as CommonAnalytics
    return (<CommonAnalyticsClient initialData={analytics_data}/>)
}