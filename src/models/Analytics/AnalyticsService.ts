"use server"
import TableHeader from "@/models/Analytics/Table/TableHeader";
import HeaderCell from "@/models/Analytics/Table/HeaderCell";
import AnalyticStorage from "@/models/Analytics/AnalyticsStorage";

class AnalyticsService {
    static async getCompaniesFullAnalytics(format:boolean = true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesFullAnalytics(format);
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

    static async getCompaniesWinLooseAnalytics() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesWinLooseAnalytics();
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

    static async getTendersAnalytics() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getTendersAnalytics();
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

export async function getCompaniesFullAnalytics(format:boolean) {
    return AnalyticsService.getCompaniesFullAnalytics(format);
}

export async function getCompaniesWinLooseAnalytics() {
    return AnalyticsService.getCompaniesWinLooseAnalytics();
}

export async function getTendersAnalytics() {
    return AnalyticsService.getTendersAnalytics();
}