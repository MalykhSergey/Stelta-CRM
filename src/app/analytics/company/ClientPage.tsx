"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByCompany} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import Company from "@/models/Company";
import {useState} from "react";
import styles from '../page.module.css';

export default function CompanyAnalyticsClient(props: { companies: Company[], initialData: StatusAnalytics }) {
    const [data, setData] = useState({
        labels: Object.keys(props.initialData.statuses), datasets: [{
            data: Object.values(props.initialData.statuses),
        }]
    })

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const analytics_data = await getStatusAnalyticsByCompany(Number.parseInt(e.currentTarget.value)) as StatusAnalytics
        setData({
            labels: Object.keys(analytics_data.statuses),
            datasets: [{
                data: Object.values(analytics_data.statuses),
            }]
        });
    }

    return (
        <>
            <div id={styles.inputsContainer}>
                <label htmlFor="Company">Организация:</label>
                <select name="Company" id="Company" onChange={loadData}>
                    {props.companies.map(company =>
                        <option key={"option" + company.id} value={company.id}>{company.name}</option>
                    )}
                </select>
            </div>
            <DoughnutChart data={data}/>
        </>
    )
}