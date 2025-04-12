"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {useMemo} from "react";
import {CompanyAnalytics} from "@/models/Old_Analytics/CompanyAnalytics";
import {getCompanyAnalyticsByStatus} from "@/models/Old_Analytics/AnalyticsService";
import getStatusName from "@/models/Tender/Status";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import ChartDataType from "@/models/Old_Analytics/ChartDataType";

class AnalyticsStore {
    data: CompanyAnalytics[]
    status: number
    type: ChartDataType

    constructor(initialData: CompanyAnalytics[]) {
        this.data = initialData
        this.status = 6
        this.type = ChartDataType.COUNT
        makeAutoObservable(this)
    }

    setData(newData: CompanyAnalytics[], status: number) {
        this.data = newData
        this.status = status
    }

    getChartData() {
        let data
        const labels = this.data.map(company_analytics => company_analytics.company.name)
        if (this.type == ChartDataType.COUNT)
            data = this.data.map(company_analytics => company_analytics.tenders_count)
        else
            data = this.data.map(company_analytics => company_analytics.tenders_price)
        return {
            title: `Тендеры со статусом "${getStatusName(this.status)}"`,
            data: {
                labels: labels,
                datasets: [{data: data}]
            }
        }
    }

    toggleType(type: ChartDataType) {
        this.type = type
    }
}

const StatusAnalyticsClient = observer((props: { initialData: CompanyAnalytics[] }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData), [props.initialData])
    const chartData = analyticsStore.getChartData()

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const status = Number.parseInt(e.target.value);
        const analytics_data = await getCompanyAnalyticsByStatus(status) as CompanyAnalytics[]
        analyticsStore.setData(analytics_data, status)
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
                <div className="row-inputs">
                    <label htmlFor="status">Статус:</label>
                    <select id="status" name="status" defaultValue={6} onChange={loadData}>
                        <option value="-4">{getStatusName(-4)}</option>
                        <option value="-1">{getStatusName(-1)}</option>
                        <option value="0">{getStatusName(0)}</option>
                        <option value="1">{getStatusName(1)}</option>
                        <option value="2">{getStatusName(2)}</option>
                        <option value="3">{getStatusName(3)}</option>
                        <option value="4">{getStatusName(4)}</option>
                        <option value="5">{getStatusName(5)}</option>
                        <option value="6">{getStatusName(6)}</option>
                    </select>
                </div>
            </div>
            <h1 className={styles.chartTitle}>{chartData.title}</h1>
            <div className={styles.chart}>
                <DoughnutChart data={chartData.data} title={chartData.title} type={analyticsStore.type}/>
            </div>
        </div>
    )
})
export default StatusAnalyticsClient