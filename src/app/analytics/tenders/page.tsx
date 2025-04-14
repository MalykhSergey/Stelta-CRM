import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import '../table.css'
import {getTendersAnalytics} from "@/models/Analytics/AnalyticsService";

export default async function page() {
    const table = await getTendersAnalytics();
    return (new JsxTable(table.headers, table.data, table.colSizes).render());
}