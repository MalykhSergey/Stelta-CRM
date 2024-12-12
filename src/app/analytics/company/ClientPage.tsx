"use client"
import {getStatusAnalyticsByCompany} from "@/models/Analytics/AnalyticsService";
import {StatusAnalytics} from "@/models/Analytics/StatusAnalytics";
import Company from "@/models/Company/Company";
import React, {useMemo} from "react";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import ChartDataType from "@/models/Analytics/ChartDataType";
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";

class AnalyticsStore {
    data: StatusAnalytics
    companyName: string
    isSpecial: boolean
    type: ChartDataType

    constructor(initialData: StatusAnalytics, companyName: string) {
        this.data = initialData
        this.companyName = companyName
        this.isSpecial = false
        this.type = ChartDataType.COUNT
        makeAutoObservable(this)
    }

    setData(newData: StatusAnalytics, companyName: string) {
        this.data = newData
        this.companyName = companyName
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
            title: `Тендеры у организации: ${this.companyName}`,
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

const CompanyAnalyticsClient = observer((props: { companies: Company[], initialData: StatusAnalytics }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData, props.companies[0].name), [props.initialData])
    const chartData = analyticsStore.getChartData()

    async function loadData(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.currentTarget.value.split("|||");
        const companyId = Number.parseInt(value[0]);
        const analyticsData = await getStatusAnalyticsByCompany(companyId) as StatusAnalytics
        analyticsStore.setData(analyticsData, value[1]);
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
                <div className="row-inputs">
                    <label htmlFor="is_special">Показывать подыгрыш:</label>
                    <input type="checkbox" id='is_special' defaultChecked={false} onChange={toggleIsSpecial}/>
                </div>
                <div className="row-inputs">
                    <label htmlFor="Company">Организация:</label>
                    <select name="Company" id="Company" onChange={loadData}>
                        {props.companies.map(company =>
                            <option key={"option" + company.id}
                                    value={`${company.id}|||${company.name}`}>{company.name}</option>
                        )}
                    </select>
                </div>
            </div>
            <h1 id={styles.chartTitle}>{chartData.title}</h1>
            <DoughnutChart data={chartData.data} title={chartData.title} type={analyticsStore.type}/>
        </div>
    )
})
export default CompanyAnalyticsClient