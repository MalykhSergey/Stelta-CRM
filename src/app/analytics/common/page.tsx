import {getCommonAnalytics} from "@/models/Analytics/AnalyticsService";
import CommonAnalyticsClient from "@/app/analytics/common/ClientPage";
import {CommonAnalytics} from "@/models/Analytics/CommonAnalytics";


export const dynamic = 'force-dynamic'
export default async function CommonAnalyticsServer() {
    const analytics_data = await getCommonAnalytics() as CommonAnalytics
    return (<CommonAnalyticsClient initialData={analytics_data}/>)
}