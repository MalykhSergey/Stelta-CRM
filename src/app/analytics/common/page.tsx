import {getCommonAnalytics} from "@/models/Analytics/AnalyticsService";
import CommonAnalyticsClient from "@/app/analytics/common/ClientPage";


export const dynamic = 'force-dynamic'
export default async function CommonAnalyticsServer() {
    const analytics_data = await getCommonAnalytics()
    return (<CommonAnalyticsClient initialData={analytics_data}/>)
}