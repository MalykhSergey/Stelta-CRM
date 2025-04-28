import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
import {FieldConfig} from "@/app/components/FilterForm/FilterForm";
import getStatusName from "@/models/Tender/Status";

export default async function get_default_fields(searchParams: Promise<{
    [p: string]: string | string[] | undefined
}>) {
    const start_param = (await searchParams).start as string
    const end_param = (await searchParams).end as string
    const statuses_param = (await searchParams).statuses as string || ''
    const statuses = statuses_param.split(',').map(value => parseInt(value))
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    const fields: FieldConfig[] = [
        {label: 'От:', name: 'start', type: 'date', defaultValue: startDate.toISOString().slice(0, 10)},
        {label: 'До:', name: 'end', type: 'date', defaultValue: endDate.toISOString().slice(0, 10)},
        {
            name: 'statuses', label: 'Этап:', type: 'multiselect', labels: [
                getStatusName(0),
                getStatusName(1),
                getStatusName(2),
                getStatusName(3),
                getStatusName(4),
                getStatusName(5),
                getStatusName(6),
                getStatusName(-1),
                getStatusName(-4),
            ],
            values: ['0', '1', '2', '3', '4', '5', '6', '-1', '-4'],
        }
    ];
    return {statuses, startDate, endDate, fields};
}