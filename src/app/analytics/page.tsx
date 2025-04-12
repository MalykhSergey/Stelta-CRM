import {getCompaniesFullAnalytics} from "@/models/Analytics/AnalyticsService";
import JsxRenderer from "@/models/Analytics/Table/JSXRenderer";
import './table.css'
export default async function page() {
    const table = await getCompaniesFullAnalytics();
    return (new JsxRenderer(table).render());
}