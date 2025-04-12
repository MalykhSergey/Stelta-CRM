import {getStatusAnalyticsByDateRange} from "@/models/Old_Analytics/AnalyticsService";
import DateRangeAnalyticsClient from "./ClientPage";
import {Metadata} from "next";
import {CumulativeStatusAnalytics} from "@/models/Old_Analytics/CumulativeStatusAnalytics";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Аналитика по дате',
}
export default async function DateRangeAnalyticsServer() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    // const startDate = new Date();
    // startDate.setDate(current_date.getDate()-15)
    // const endDate = new Date();
    // endDate.setDate(current_date.getDate()+15)

    const analytics_data = await getStatusAnalyticsByDateRange(
        startDate.toLocaleDateString('en-CA'), endDate.toLocaleDateString('en-CA')) as CumulativeStatusAnalytics
    return (
        <DateRangeAnalyticsClient initialData={analytics_data} startDate={startDate} endDate={endDate}/>)
}