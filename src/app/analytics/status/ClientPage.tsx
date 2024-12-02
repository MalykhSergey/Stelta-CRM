"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {useState} from "react";
import {CompanyAnalytics} from "@/models/Analytics/CompanyAnalytics";
import {getCompanyAnalyticsByStatus} from "@/models/Analytics/AnalyticsService";
import getStatusName from "@/models/Status";
import styles from '../page.module.css';

export default function StatusAnalyticsClient(props: { initialData: CompanyAnalytics[] }) {

    const [chartData, setChartData] = useState({
        title: "Тендеры на стадии: Новый тендер",
        data: {
            labels: props.initialData.map(company_analytics => company_analytics.company.name), datasets: [{
                data: props.initialData.map(company_analytics => company_analytics.tenders_count)
            }]
        }
    })

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const status = Number.parseInt(e.target.value);
        const analytics_data = await getCompanyAnalyticsByStatus(status) as CompanyAnalytics[]
        setChartData({
            title: `Тендеры на стадии: ${getStatusName(status)}`,
            data: {
                labels: analytics_data.map(company_analytics => company_analytics.company.name), datasets: [{
                    data: analytics_data.map(company_analytics => company_analytics.tenders_count)
                }]
            }
        })
    }

    return (
        <>
            <div id={styles.inputsContainer}>
                <label htmlFor="status">Статус:</label>
                <select id="status" name="status" defaultValue={6} onChange={loadData}>
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
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </>
    )
}