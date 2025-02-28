"use client"
import BarChart from "@/app/analytics/date/BarChart";
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByDateRange} from "@/models/Analytics/AnalyticsService";
import ChartDataType from "@/models/Analytics/ChartDataType";
import {CountInDate, CumulativeStatusAnalytics} from "@/models/Analytics/CumulativeStatusAnalytics";
import getStatusName from "@/models/Tender/Status";
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import React, {useMemo, useRef} from "react";
import styles from '../page.module.css';
import CFD from "./CFD";

class AnalyticsStore {
    data: CumulativeStatusAnalytics
    startDate: string
    endDate: string
    isSpecial: boolean
    type: ChartDataType

    constructor(initialData: CumulativeStatusAnalytics, startDate: string, endDate: string) {
        this.data = initialData
        this.isSpecial = false
        this.startDate = startDate
        this.endDate = endDate
        this.type = ChartDataType.COUNT
        makeAutoObservable(this)
    }

    setData(newData: CumulativeStatusAnalytics, startDateString: string, endDateString: string) {
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

    getCumulativeChartData() {
        const data = this.data.cumulative_status_price
        const labels = ["Новый тендер", "Подготовка заявки 1 Этап", "Заявка подана 1 этап", "Подготовка заявки 2 Этап", "Заявка подана 2 этап", "Заключение договора", "Договор заключен"]
        return {
            title: `Воронка продаж за период: ${this.startDate} – ${this.endDate}`,
            data: {
                labels: labels,
                datasets: [{
                    data: data, categoryPercentage: 1, backgroundColor: [
                        "rgb(54, 162, 235)",
                        "rgb(255, 99, 132)",
                        "rgb(255, 159, 64)",
                        "rgb(255, 205, 86)",
                        "rgb(75, 192, 192)",
                        "rgb(153, 102, 255)",
                        "rgb(201, 203, 207)"
                    ],
                }]
            }
        }
    }

    getStatusHistoryData() {
        const datasets = this.data.status_counts_history.map((status, index) => {
            return {
                data: status.map((value: CountInDate) => {
                    return {x: value.date, y: value.count}
                }),
                label: getStatusName(index),
                order: -index,
                fill: true,
            }
        })
        return {
            title: `История изменений: ${this.startDate} – ${this.endDate}`,
            data: {
                datasets: datasets
            }
        }
    }

    getCFDData() {
        const datasets = this.data.status_counts_history.map((status, index) => {
            return {
                data: status.map((value: CountInDate) => {
                    return {x: value.date, y: value.cumulative_count}
                }), label: getStatusName(index),
                order: -index,
                fill: true
            }
        })
        return {
            title: `CFD: ${this.startDate} – ${this.endDate}`,
            data: {
                datasets: datasets
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
    initialData: CumulativeStatusAnalytics,
    startDate: Date,
    endDate: Date
}) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData, props.startDate.toLocaleDateString('ru-RU'), props.endDate.toLocaleDateString('ru-RU')), [props.endDate, props.initialData, props.startDate])
    const chartData = analyticsStore.getChartData()
    const cumulativeChartData = analyticsStore.getCumulativeChartData()
    const historyData = analyticsStore.getStatusHistoryData();
    const cfdData = analyticsStore.getCFDData();
    const startDateInput = useRef<HTMLInputElement | null>(null)
    const endDateInput = useRef<HTMLInputElement | null>(null)

    async function loadData() {
        const startDate = startDateInput.current!.value;
        const endDate = endDateInput.current!.value;
        if (!Date.parse(startDate) || !Date.parse(endDate))
            return
        const analytics_data = await getStatusAnalyticsByDateRange(startDate, endDate) as CumulativeStatusAnalytics
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
                    <div className='row-inputs'>
                        <label htmlFor="startDateInput">От:</label>
                        <input id="startDateInput" ref={startDateInput} type="date"
                               defaultValue={props.startDate.toLocaleDateString('en-CA')}
                               onChange={loadData}/>
                    </div>
                    <div className='row-inputs'>
                        <label htmlFor="endDateInput">До:</label>
                        <input id="endDateInput" ref={endDateInput} type="date"
                               defaultValue={props.endDate.toLocaleDateString('en-CA')}
                               onChange={loadData}/>
                    </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                rowGap: '60px',
                columnGap: '20px'
            }}>
                <div>
                    <h2 className={styles.chartTitle}>{chartData.title}</h2>
                    <div className={styles.chart}>
                        <DoughnutChart data={chartData.data} title={chartData.title} type={analyticsStore.type}/>
                    </div>
                </div>
                <div>
                    <h2 className={styles.chartTitle}>{cumulativeChartData.title}</h2>
                    <div className={styles.chart}>
                        <BarChart data={cumulativeChartData.data}/>
                    </div>
                </div>
                <div>
                    <h2 className={styles.chartTitle}>{historyData.title}</h2>
                    <div className={styles.chart}>
                        <CFD data={historyData.data}/>
                    </div>
                </div>
                <div>
                    <h2 className={styles.chartTitle}>{cfdData.title}</h2>
                    <div className={styles.chart}>
                        <CFD data={cfdData.data}/>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default DateRangeAnalyticsClient