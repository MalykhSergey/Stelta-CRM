"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {useState} from "react";
import {CompanyAnalytics} from "@/models/Analytics/CompanyAnalytics";
import {getCompanyAnalyticsByStatus} from "@/models/Analytics/AnalyticsService";
import styles from "@/app/components/TenderForm/TenderForm.module.css";
import getStatusName from "@/models/Status";


export default function StatusAnalyticsClient(props: { initialData: CompanyAnalytics[] }) {

    const [data, setData] = useState({
        labels: props.initialData.map(company_analytics => company_analytics.company.name), datasets: [{
            data: props.initialData.map(company_analytics => company_analytics.tenders_count)
        }]
    })

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const analytics_data = await getCompanyAnalyticsByStatus(Number.parseInt(e.target.value)) as CompanyAnalytics[]
        setData({
            labels: analytics_data.map(company_analytics => company_analytics.company.name), datasets: [{
                data: analytics_data.map(company_analytics => company_analytics.tenders_count)
            }]
        })
    }

    return (
        <>
            <label htmlFor="status">Статус:</label>
            <select id="status" name="status" defaultValue={6} className={styles.input} onChange={loadData}>
                <option value="-1">{getStatusName(-1)}</option>
                <option value="0">{getStatusName(0)}</option>
                <option value="1">{getStatusName(1)}</option>
                <option value="2">{getStatusName(2)}</option>
                <option value="3">{getStatusName(3)}</option>
                <option value="4">{getStatusName(4)}</option>
                <option value="5">{getStatusName(5)}</option>
                <option value="6">{getStatusName(6)}</option>
            </select>
            <DoughnutChart data={data}/>
        </>
    )
}