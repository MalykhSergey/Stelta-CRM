"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {useMemo} from "react";
import {CompanyAnalytics} from "@/models/Analytics/CompanyAnalytics";
import {getCompanyAnalyticsByStatus} from "@/models/Analytics/AnalyticsService";
import getStatusName from "@/models/Status";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";

class AnalyticsStore {
    data: CompanyAnalytics[]
    status: number

    constructor(initialData: CompanyAnalytics[]) {
        this.data = initialData
        this.status = 6
        makeAutoObservable(this)
    }

    setData(newData: CompanyAnalytics[], status: number) {
        this.data = newData
        this.status = status
    }
}

const StatusAnalyticsClient = observer((props: { initialData: CompanyAnalytics[] }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData), [props.initialData])
    const chartData = {
        title: `Статус: ${getStatusName(analyticsStore.status)}`,
        data: {
            labels: analyticsStore.data.map(company_analytics => company_analytics.company.name), datasets: [{
                data: analyticsStore.data.map(company_analytics => company_analytics.tenders_count)
            }]
        }
    }

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const status = Number.parseInt(e.target.value);
        const analytics_data = await getCompanyAnalyticsByStatus(status) as CompanyAnalytics[]
        analyticsStore.setData(analytics_data, status)
    }

    return (
        <div id={styles.chartPage}>
            <div id={styles.inputsContainer}>
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
            <h1 id={styles.chartTitle}>{chartData.title}</h1>
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </div>
    )
})
export default StatusAnalyticsClient