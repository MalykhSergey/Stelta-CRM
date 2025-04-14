import '../table.css'
import {getCompaniesWinLooseAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";

export default async function page() {
    const table = await getCompaniesWinLooseAnalytics();
    return (new RollupTable(table.headers, table.data, table.colSizes).render())
}