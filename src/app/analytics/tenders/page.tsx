import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import '../table.css'
import {getTendersAnalytics} from "@/models/Analytics/AnalyticsService";
import {Metadata} from "next";
import {FilterForm} from "@/app/components/FilterForm/FilterForm";
import get_default_fields from "@/app/analytics/common_util";

export const metadata: Metadata = {
    title: 'Аналитика: тендеры',
}
export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const {statuses, startDate, endDate, fields} = await get_default_fields(searchParams);
    const table = await getTendersAnalytics(startDate, endDate, statuses, true);
    return (<>
        <FilterForm fields={fields}/>
        <div className='align-left-2'>
            {new JsxTable(table.headers, table.data, table.colSizes).render()}
        </div>
    </>);
}