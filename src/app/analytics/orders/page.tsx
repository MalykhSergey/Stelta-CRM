import {getOrdersAnalytics} from "@/models/Analytics/AnalyticsService";
import RollupTable from "@/models/Analytics/Table/JSX/RollupTable";
import {Metadata} from "next";
import {FilterForm} from "@/app/components/FilterForm/FilterForm";
import {getParentContracts} from "@/models/Tender/TenderService";
import get_default_fields from "@/app/analytics/common_util";

export const metadata: Metadata = {
    title: 'Аналитика: заказы',
}
export default async function page({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const contract_number = (await searchParams).contract_number as string || ''
    const contract_numbers = (await getParentContracts()).map(value => {
        return value.contract_number
    });
    const {statuses, startDate, endDate, fields} = await get_default_fields(searchParams);
    fields.push({
        label: 'Номер договора:', name: 'contract_number', type: 'dropdown',
        values: contract_numbers,
    })
    const table = await getOrdersAnalytics(startDate, endDate, statuses, contract_number, true);
    return (<>
        <FilterForm fields={fields}/>
        <div className='align-left-2'>
            {new RollupTable(table.headers, table.data, table.colSizes, 3).render()}
        </div>
    </>)
}