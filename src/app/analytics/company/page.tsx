import {getCompaniesFullAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";
import {Metadata} from "next";
import {FilterForm} from "@/app/components/FilterForm/FilterForm";
import get_default_fields from "@/app/analytics/common_util";

export const metadata: Metadata = {
    title: 'Аналитика: организации',
}

export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const {statuses, startDate, endDate, fields} = await get_default_fields(searchParams);
    const table = await getCompaniesFullAnalytics(startDate, endDate, statuses, true);
    return (<>
        <FilterForm fields={fields}/>
        {new RollupTable(table.headers, table.data, table.colSizes).render()}
    </>)
}