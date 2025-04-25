"use server"
import TableHeader from "@/models/Analytics/Table/TableHeader";
import HeaderCell from "@/models/Analytics/Table/HeaderCell";
import AnalyticStorage from "@/models/Analytics/AnalyticsStorage";

class AnalyticsService {
    static async getCompaniesFullAnalytics(startDate: Date, endDate: Date, format: boolean = true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesFullAnalytics(startDate, endDate, format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик", 1, 2),
                new HeaderCell("Подписание договора / Договор заключён", 2),
                new HeaderCell("Тендеры с высокой вероятностью победы", 2),
                new HeaderCell("Тендеры с низкой вероятностью победы", 2),
                new HeaderCell("Формирование лимита", 2),
                new HeaderCell("Итог количество", 1, 2),
                new HeaderCell("Итог сумма (без НДС)", 1, 2),
            ]),
            new TableHeader([
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)"),
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)"),
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)"),
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)")
            ])
        ];
        return {headers: headers, data: data, colSizes: [0.2]};
    }

    static async getCompaniesWinLooseAnalytics(startDate: Date, endDate: Date, format: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesWinLooseAnalytics(startDate, endDate, format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик", 1, 2),
                new HeaderCell("Победили", 2),
                new HeaderCell("Проиграли", 2),
            ]),
            new TableHeader([
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)"),
                new HeaderCell("количество"),
                new HeaderCell("сумма (без НДС)"),
            ])
        ];
        return {headers: headers, data: data, colSizes: [0.4]};
    }

    static async getTendersAnalytics(startDate: Date, endDate: Date, format: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getTendersAnalytics(startDate, endDate, format);
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик"),
                new HeaderCell("Объект"),
                new HeaderCell("НМЦК (без НДС)"),
                new HeaderCell("Стоимость (без НДС)"),
                new HeaderCell("Дата предоставления ТКП"),
                new HeaderCell("Статус"),
            ])
        ];
        return {headers: headers, data: data, colSizes: [0.15, 0.3, 0.15, 0.15, 0.1, 0.15,]};
    }

    static async getOrdersAnalytics(startDate: Date, endDate: Date, contractNumber: string, format: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getOrdersAnalytics(startDate, endDate, contractNumber, format);
        const headers = [
            new TableHeader([
                new HeaderCell("Номер договора"),
                new HeaderCell("Наименование"),
                new HeaderCell("Дата"),
                new HeaderCell("Сумма"),
            ])
        ];
        return {headers: headers, data: data, colSizes:[0.2, 0.5,0.1,0.2]};
    }
}

export async function getCompaniesFullAnalytics(startDate: Date, endDate: Date, format: boolean) {
    return AnalyticsService.getCompaniesFullAnalytics(startDate, endDate, format);
}

export async function getCompaniesWinLooseAnalytics(startDate: Date, endDate: Date, format: boolean) {
    return AnalyticsService.getCompaniesWinLooseAnalytics(startDate, endDate, format);
}

export async function getTendersAnalytics(startDate: Date, endDate: Date, format: boolean) {
    return AnalyticsService.getTendersAnalytics(startDate, endDate, format);
}

export async function getOrdersAnalytics(startDate: Date, endDate: Date, contractNumber: string, format: boolean) {
    return AnalyticsService.getOrdersAnalytics(startDate, endDate, contractNumber, format)
}