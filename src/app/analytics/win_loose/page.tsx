import '../table.css'
import {getCompaniesWinLooseAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Аналитика: победили / проиграли',
}
export default async function page() {
    const table = await getCompaniesWinLooseAnalytics(true);
    return (new RollupTable(table.headers, table.data, table.colSizes).render())
}