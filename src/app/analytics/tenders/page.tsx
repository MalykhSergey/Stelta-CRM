import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import '../table.css'
import {getTendersAnalytics} from "@/models/Analytics/AnalyticsService";
import {Metadata} from "next";
import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
export const metadata: Metadata = {
    title: 'Аналитика: тендеры',
}
export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const start_param = (await searchParams).start as string
    const end_param = (await searchParams).end as string
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    const table = await getTendersAnalytics(startDate,endDate,true);
    return (new JsxTable(table.headers, table.data, table.colSizes).render());
}