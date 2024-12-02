import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {getCommonAnalytics} from "@/app/models/Analytics/AnalyticsService";


export default async function CommonAnalytics() {
    const analytics_data = await getCommonAnalytics()
    const data = {
        labels: [
            'Победа',
            'Не участвуем',
            'Проиграли',
            'Подыгрыш',
        ],
        datasets: [{
            data: [analytics_data.win_count, analytics_data.not_participate_count, analytics_data.loose_count, analytics_data.special_count],
        }]
    };
    return (
        <>
            <DoughnutChart data={data}/>
        </>
    )
}