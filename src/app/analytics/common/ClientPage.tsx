"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {CommonAnalytics} from "@/models/Analytics/CommonAnalytics";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import ChartDataType from "@/models/Analytics/ChartDataType";

class AnalyticsStore {
    data: CommonAnalytics
    isSpecial: boolean
    type: ChartDataType

    constructor(initialData: CommonAnalytics) {
        this.data = initialData
        this.isSpecial = true
        this.type = ChartDataType.COUNT
        makeAutoObservable(this)
    }

    getChartData() {
        let data = []
        const labels = ['Победа', 'Не участвуем', 'Проиграли']
        if (this.type == ChartDataType.COUNT)
            data = [this.data.win_count, this.data.not_participate_count, this.data.loose_count,]
        else
            data = [this.data.win_price, this.data.not_participate_price, this.data.loose_price,]
        if (this.isSpecial) {
            labels.push("Подыгрыш")
            if (this.type == ChartDataType.COUNT)
                data.push(this.data.special_count)
            else
                data.push(this.data.special_price)
        } else {
            if (this.type == ChartDataType.COUNT)
                data[2] += this.data.special_count
            else
                data[2] += this.data.special_price
        }
        return {
            title: "Общая аналитика",
            data: {
                labels: labels,
                datasets: [{data: data}]
            }
        }
    }

    toggleType(type: ChartDataType) {
        this.type = type
    }

    toggleIsSpecial() {
        this.isSpecial = !this.isSpecial
    }
}

const CommonAnalyticsClient = observer((props: { initialData: CommonAnalytics }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData), [props.initialData])
    const chartData = analyticsStore.getChartData();

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
                    <input type="checkbox" id='is_special' defaultChecked={true} onChange={toggleIsSpecial}/>
                </div>
            </div>
            <h1 className={styles.chartTitle}>Общая аналитика по тендерам</h1>
            <DoughnutChart data={chartData.data} title={chartData.title} type={analyticsStore.type}/>
        </div>
    )
})
export default CommonAnalyticsClient