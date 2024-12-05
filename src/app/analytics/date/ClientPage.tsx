"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByDateRange} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import {useMemo, useRef} from "react";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";

class AnalyticsStore {
    data: StatusAnalytics
    startDate: string
    endDate: string
    isSpecial: boolean

    constructor(initialData: StatusAnalytics, startDate: string, endDate: string) {
        this.data = initialData
        this.isSpecial = false
        this.startDate = startDate
        this.endDate = endDate
        makeAutoObservable(this)
    }

    setData(newData: StatusAnalytics, startDateString: string, endDateString: string) {
        this.data = newData
        this.startDate = startDateString
        this.endDate = endDateString
    }

    toggle() {
        this.isSpecial = !this.isSpecial
    }
}

const DateRangeAnalyticsClient = observer((props: {
    initialData: StatusAnalytics,
    startDate: Date,
    endDate: Date
}) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData, props.startDate.toLocaleDateString('ru-RU'), props.endDate.toLocaleDateString('ru-RU')), [props.initialData])
    const chartData = {
        title: `Тендеры за период: ${analyticsStore.startDate} – ${analyticsStore.endDate}`,
        data: {
            labels: Object.keys(analyticsStore.data.statuses),
            datasets: [{
                data: Object.values(analyticsStore.data.statuses),
            }],
        }
    }
    if (analyticsStore.isSpecial) {
        chartData.data.labels.push('Подыгрыш')
        chartData.data.datasets[0].data.push(analyticsStore.data.special_count)
    }
    const startDateInput = useRef<HTMLInputElement | null>(null)
    const endDateInput = useRef<HTMLInputElement | null>(null)

    async function loadData() {
        const startDate = startDateInput.current!.value;
        const endDate = endDateInput.current!.value;
        if (!Date.parse(startDate) || !Date.parse(endDate))
            return
        const analytics_data = await getStatusAnalyticsByDateRange(startDate, endDate) as StatusAnalytics
        analyticsStore.setData(analytics_data, startDate, endDate)
    }

    function toggleIsSpecial() {
        analyticsStore.toggle()
    }

    return (
        <div id={styles.chartPage}>
            <div id={styles.inputsContainer}>
                <label htmlFor="is_special">Показывать подыгрыш:</label>
                <input type="checkbox" id='is_special' defaultChecked={false} onChange={toggleIsSpecial}/>
                <div className='row-inputs'>
                    <label htmlFor="startDateInput">От:</label>
                    <input id="startDateInput" ref={startDateInput} type="date"
                           defaultValue={props.startDate.toLocaleDateString('en-CA')}
                           onChange={loadData}/>
                </div>
                <div className="row-inputs">
                    <label htmlFor="endDateInput">До:</label>
                    <input id="endDateInput" ref={endDateInput} type="date"
                           defaultValue={props.endDate.toLocaleDateString('en-CA')}
                           onChange={loadData}/>
                </div>
            </div>
            <h1 id={styles.chartTitle}>{chartData.title}</h1>
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </div>
    )
})
export default DateRangeAnalyticsClient