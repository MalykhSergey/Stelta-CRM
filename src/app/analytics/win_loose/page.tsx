import '../table.css'
import {getCompaniesWinLooseAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";
import {Metadata} from "next";
import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
export const metadata: Metadata = {
    title: 'Аналитика: победили / проиграли',
}
export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const start_param = (await searchParams).start as string
    const end_param = (await searchParams).end as string
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    const table = await getCompaniesWinLooseAnalytics(startDate,endDate,true);
    return (new RollupTable(table.headers, table.data, table.colSizes).render())
}