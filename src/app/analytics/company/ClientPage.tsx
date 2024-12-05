"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getStatusAnalyticsByCompany} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import Company from "@/models/Company/Company";
import React, {useMemo} from "react";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";

class AnalyticsStore {
    data: StatusAnalytics
    companyName: string
    isSpecial: boolean

    constructor(initialData: StatusAnalytics, companyName: string) {
        this.data = initialData
        this.companyName = companyName
        this.isSpecial = false
        makeAutoObservable(this)
    }

    setData(newData: StatusAnalytics, companyName: string) {
        this.data = newData
        this.companyName = companyName
    }

    toggle() {
        this.isSpecial = !this.isSpecial
    }
}

const CompanyAnalyticsClient = observer((props: { companies: Company[], initialData: StatusAnalytics }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData, props.companies[0].name), [props.initialData])
    const chartData = {
        title: `Тендеры у организации: ${analyticsStore.companyName}`,
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

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.currentTarget.value.split("|||");
        const companyId = Number.parseInt(value[0]);
        const analyticsData = await getStatusAnalyticsByCompany(companyId) as StatusAnalytics
        analyticsStore.setData(analyticsData, value[1]);
    }

    function toggleIsSpecial() {
        analyticsStore.toggle()
    }

    return (
        <div id={styles.chartPage}>
            <div id={styles.inputsContainer}>
                <label htmlFor="is_special">Показывать подыгрыш:</label>
                <input type="checkbox" id='is_special' defaultChecked={false} onChange={toggleIsSpecial}/>
                <label htmlFor="Company">Организация:</label>
                <select name="Company" id="Company" onChange={loadData}>
                    {props.companies.map(company =>
                        <option key={"option" + company.id}
                                value={`${company.id}|||${company.name}`}>{company.name}</option>
                    )}
                </select>
            </div>
            <h1 id={styles.chartTitle}>{chartData.title}</h1>
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </div>
    )
})
export default CompanyAnalyticsClient