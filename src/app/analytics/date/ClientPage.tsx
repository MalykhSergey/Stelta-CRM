"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByDateRange} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import {useRef, useState} from "react";
import styles from '../page.module.css';


export default function DateRangeAnalyticsClient(props: {
    initialData: StatusAnalytics,
    startDate: Date,
    endDate: Date
}) {
    const [chartData, setChartData] = useState({
        title: `Тендеры за период: ${props.startDate.toLocaleDateString('ru-RU')} – ${props.endDate.toLocaleDateString('ru-RU')}`,
        data: {
            labels: Object.keys(props.initialData.statuses), datasets: [{
                data: Object.values(props.initialData.statuses),
            }]
        }
    })
    const startDateInput = useRef<HTMLInputElement | null>(null)
    const endDateInput = useRef<HTMLInputElement | null>(null)

    async function loadData() {
        if (!Date.parse(startDateInput.current!.value) || !Date.parse(endDateInput.current!.value))
            return
        const analytics_data = await getStatusAnalyticsByDateRange(startDateInput.current!.value, endDateInput.current!.value) as StatusAnalytics
        setChartData({
            title: `Тендеры за период:${new Date(startDateInput.current!.value).toLocaleDateString('ru-RU')}-${new Date(endDateInput.current!.value).toLocaleDateString('ru-RU')}`,
            data: {
                labels: Object.keys(analytics_data.statuses),
                datasets: [{
                    data: Object.values(analytics_data.statuses),
                }]
            }
        })
    }

    return (
        <>
            <div id={styles.inputsContainer}>
                <label htmlFor="startDateInput">От:</label>
                <input id="startDateInput" ref={startDateInput} type="date"
                       defaultValue={props.startDate.toLocaleDateString('en-CA')}
                       onChange={loadData}/>
                <label htmlFor="endDateInput">До:</label>
                <input id="endDateInput" ref={endDateInput} type="date"
                       defaultValue={props.endDate.toLocaleDateString('en-CA')}
                       onChange={loadData}/>
            </div>
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </>
    )
}