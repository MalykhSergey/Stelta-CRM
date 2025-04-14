import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import '../table.css'
import {getTendersAnalytics} from "@/models/Analytics/AnalyticsService";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Аналитика: тендеры',
}
export default async function page() {
    const table = await getTendersAnalytics(true);
    return (new JsxTable(table.headers, table.data, table.colSizes).render());
}