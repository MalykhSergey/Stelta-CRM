import {getCompaniesFullAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";
import {Metadata} from "next";

import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
import {FieldConfig, FilterForm} from "@/app/components/FilterForm/FilterForm";

export const metadata: Metadata = {
    title: 'Аналитика: организации',
}
export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const start_param = (await searchParams).start as string
    const end_param = (await searchParams).end as string
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    const table = await getCompaniesFullAnalytics(startDate, endDate, true);
    const fields: FieldConfig[] = [
        {label: 'От:', name: 'start', type: 'date', defaultValue:startDate.toISOString().slice(0, 10)},
        {label: 'До:', name: 'end', type: 'date', defaultValue:endDate.toISOString().slice(0, 10)},
    ];
    return (<>
        <FilterForm fields={fields}/>
        {new RollupTable(table.headers, table.data, table.colSizes).render()}
    </>)
}