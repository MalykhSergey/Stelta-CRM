"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByDateRange} from "@/app/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/app/models/Analytics/StatusAnalytics";
import {useRef, useState} from "react";
import styles from '../page.module.css';


export default function DateRangeAnalyticsClient(props: {
    initialData: StatusAnalytics,
    startDate: string,
    endDate: string
}) {
    const [data, setData] = useState({
        labels: Object.keys(props.initialData.statuses), datasets: [{
            data: Object.values(props.initialData.statuses),
        }]
    })
    const startDateInput = useRef<HTMLInputElement | null>(null)
    const endDateInput = useRef<HTMLInputElement | null>(null)

    async function loadData() {
        const analytics_data = await getStatusAnalyticsByDateRange(startDateInput.current!.value, endDateInput.current!.value) as StatusAnalytics
        const data = {
            labels: Object.keys(analytics_data.statuses),
            datasets: [{
                data: Object.values(analytics_data.statuses),
            }]
        };
        setData(data)
    }

    return (
        <>
            <div id={styles.inputsContainer}>
                <input ref={startDateInput} type="date" defaultValue={props.startDate} onChange={loadData}/>
                <input ref={endDateInput} type="date" defaultValue={props.endDate} onChange={loadData}/>
            </div>
            <DoughnutChart data={data}/>
        </>
    )
}