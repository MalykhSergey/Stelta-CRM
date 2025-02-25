import {getStatusAnalyticsByDateRange} from "@/models/Analytics/AnalyticsService";
import DateRangeAnalyticsClient from "./ClientPage";
import {Metadata} from "next";
import {CumulativeStatusAnalytics} from "@/models/Analytics/CumulativeStatusAnalytics";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Аналитика по дате',
}
export default async function DateRangeAnalyticsServer() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const analytics_data = await getStatusAnalyticsByDateRange(
        startDate.toLocaleDateString('en-CA'), endDate.toLocaleDateString('en-CA')) as CumulativeStatusAnalytics
    return (
        <DateRangeAnalyticsClient initialData={analytics_data} startDate={startDate} endDate={endDate}/>)
}