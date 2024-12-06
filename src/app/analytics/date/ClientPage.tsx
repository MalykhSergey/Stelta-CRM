"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByDateRange} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import React, {useMemo, useRef} from "react";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import ChartDataType from "@/models/Analytics/ChartDataType";

class AnalyticsStore {
    data: StatusAnalytics
    startDate: string
    endDate: string
    isSpecial: boolean
    type: ChartDataType

    constructor(initialData: StatusAnalytics, startDate: string, endDate: string) {
        this.data = initialData
        this.isSpecial = false
        this.startDate = startDate
        this.endDate = endDate
        this.type = ChartDataType.COUNT
        makeAutoObservable(this)
    }

    setData(newData: StatusAnalytics, startDateString: string, endDateString: string) {
        this.data = newData
        this.startDate = startDateString
        this.endDate = endDateString
    }

        getChartData() {
            let data
            const labels = Object.keys(this.data.status_counts)
            if (this.type == ChartDataType.COUNT)
                data = Object.values(this.data.status_counts)
            else
                data = Object.values(this.data.status_price)
            if (this.isSpecial) {
                labels.push("Подыгрыш")
                if (this.type == ChartDataType.COUNT)
                    data.push(this.data.special_count)
                else
                    data.push(this.data.special_price)
            }
            return {
                title: `Тендеры за период: ${this.startDate} – ${this.endDate}`,
                data: {
                    labels: labels,
                    datasets: [{data: data}]
                }
            }
        }

    toggleIsSpecial() {
        this.isSpecial = !this.isSpecial
    }

    toggleType(type: ChartDataType) {
        this.type = type
    }
}

const DateRangeAnalyticsClient = observer((props: {
    initialData: StatusAnalytics,
    startDate: Date,
    endDate: Date
}) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData, props.startDate.toLocaleDateString('ru-RU'), props.endDate.toLocaleDateString('ru-RU')), [props.initialData])
    const chartData = analyticsStore.getChartData()
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
        analyticsStore.toggleIsSpecial()
    }

    function toggleType(typeForm: React.ChangeEvent<HTMLInputElement>) {
        analyticsStore.toggleType(Number.parseInt(typeForm.currentTarget.value))
    }

    return (
        <div id={styles.chartPage}>
            <div id={styles.inputsContainer}>
                <div className="row-inputs">
                    <label htmlFor="count">Количество:</label>
                    <input id='count' type="radio" name='type' value='0' onChange={toggleType} defaultChecked={true}/>
                    <label htmlFor="sum">Цена:</label>
                    <input id='sum' type="radio" name='type' value='1' onChange={toggleType}/>
                </div>
                <div className='row-inputs'>
                    <label htmlFor="is_special">Показывать подыгрыш:</label>
                    <input type="checkbox" id='is_special' defaultChecked={false} onChange={toggleIsSpecial}/>
                </div>
                <div className='row-inputs'>
                    <label htmlFor="startDateInput">От:</label>
                    <input id="startDateInput" ref={startDateInput} type="date"
                           defaultValue={props.startDate.toLocaleDateString('en-CA')}
                           onChange={loadData}/>
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