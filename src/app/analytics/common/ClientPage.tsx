"use client"
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {CommonAnalytics} from "@/models/Analytics/CommonAnalytics";
import styles from '../page.module.css';
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import {useMemo} from "react";

class AnalyticsStore {
    data: CommonAnalytics
    isSpecial: boolean

    constructor(initialData: CommonAnalytics) {
        this.data = initialData
        this.isSpecial = false
        makeAutoObservable(this)
    }

    setData(newData: CommonAnalytics) {
        this.data = newData
    }

    toggle() {
        this.isSpecial = !this.isSpecial
    }
}

const CommonAnalyticsClient = observer((props: { initialData: CommonAnalytics }) => {
    const analyticsStore = useMemo(() => new AnalyticsStore(props.initialData), [props.initialData])
    const chartData = {
        title: "Общая аналитика",
        data: {
            labels: [
                'Победа',
                'Не участвуем',
                'Проиграли',
            ],
            datasets: [{
                data: [
                    analyticsStore.data.win_count,
                    analyticsStore.data.not_participate_count,
                    analyticsStore.data.loose_count,
                ],
            }]
        }
    }
    if (analyticsStore.isSpecial) {
        chartData.data.datasets[0].data[2] += analyticsStore.data.special_count
    } else {
        chartData.data.labels.push('Подыгрыш')
        chartData.data.datasets[0].data.push(analyticsStore.data.special_count)
    }

    function toggleIsSpecial() {
        analyticsStore.toggle()
    }

    return (
        <div id={styles.chartPage}>
            <div id={styles.inputsContainer}>
                <label htmlFor="is_special">Показывать подыгрыш:</label>
                <input type="checkbox" id='is_special' defaultChecked={true} onChange={toggleIsSpecial}/>
            </div>
            <h1 id={styles.chartTitle}>Общая аналитика по тендерам</h1>
            <DoughnutChart data={chartData.data} title={chartData.title}/>
        </div>
    )
})
export default CommonAnalyticsClient