"use server"
import TableHeader from "@/models/Analytics/Table/TableHeader";
import HeaderCell from "@/models/Analytics/Table/HeaderCell";
import AnalyticStorage from "@/models/Analytics/AnalyticsStorage";

class AnalyticsService {
    static async getCompaniesFullAnalytics(startDate:Date,endDate:Date,format:boolean = true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesFullAnalytics(startDate,endDate,format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик", 1, 2),
                new HeaderCell("Подписание договора / Договор заключён", 2),
                new HeaderCell("Тендеры с высокой вероятностью", 2),
                new HeaderCell("Тендеры с низкой вероятностью", 2),
                new HeaderCell("Формирование лимита", 2),
                new HeaderCell("Итог количество", 1, 2),
                new HeaderCell("Итог сумма", 1, 2),
            ]),
            new TableHeader([
                new HeaderCell("количество"),
                new HeaderCell("сумма"),
                new HeaderCell("количество"),
                new HeaderCell("сумма"),
                new HeaderCell("количество"),
                new HeaderCell("сумма"),
                new HeaderCell("количество"),
                new HeaderCell("сумма")
            ])
        ];
        return {headers: headers, data: data, colSizes: [0.2]};
    }

    static async getCompaniesWinLooseAnalytics(startDate:Date,endDate:Date,format:boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesWinLooseAnalytics(startDate,endDate,format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик", 1, 2),
                new HeaderCell("Победа", 2),
                new HeaderCell("Проиграли", 2),
            ]),
            new TableHeader([
                new HeaderCell("количество"),
                new HeaderCell("сумма"),
                new HeaderCell("количество"),
                new HeaderCell("сумма"),
            ])
        ];
        return {headers: headers, data: data, colSizes: []};
    }

    static async getTendersAnalytics(startDate:Date,endDate:Date,format:boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getTendersAnalytics(startDate,endDate,format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик"),
                new HeaderCell("Объект"),
                new HeaderCell("Стоимость"),
                new HeaderCell("Дата"),
                new HeaderCell("Статус"),
            ])
        ];
        return {headers: headers, data: data, colSizes: [0.2, 0.4, 0.1, 0.1, 0.2,]};
    }
}

export async function getCompaniesFullAnalytics(startDate:Date,endDate:Date,format:boolean) {
    return AnalyticsService.getCompaniesFullAnalytics(startDate,endDate,format);
}

export async function getCompaniesWinLooseAnalytics(startDate:Date,endDate:Date,format:boolean) {
    return AnalyticsService.getCompaniesWinLooseAnalytics(startDate,endDate,format);
}

export async function getTendersAnalytics(startDate:Date,endDate:Date,format:boolean) {
    return AnalyticsService.getTendersAnalytics(startDate,endDate,format);
}