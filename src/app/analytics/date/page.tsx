import {getStatusAnalyticsByDateRange} from "@/app/models/Analytics/AnalyticsService";
import DateRangeAnalyticsClient from "./ClientPage";
import {StatusAnalytics} from "@/app/models/Analytics/StatusAnalytics";

export default async function DateRangeAnalyticsServer() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const startDateString = startDate.toLocaleDateString('en-CA');
    const endDateString = endDate.toLocaleDateString('en-CA');

    const analytics_data = await getStatusAnalyticsByDateRange(startDateString, endDateString) as StatusAnalytics
    return (
        <DateRangeAnalyticsClient initialData={analytics_data} startDate={startDateString} endDate={endDateString}/>)
}