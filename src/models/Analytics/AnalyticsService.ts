"use server"
import TableHeader from "@/models/Analytics/Table/TableHeader";
import HeaderCell from "@/models/Analytics/Table/HeaderCell";
import Table from "@/models/Analytics/Table/Table";
import AnalyticStorage from "@/models/Analytics/AnalyticsStorage";

class AnalyticsService {
    static async getCompaniesFullAnalytics() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await AnalyticStorage.getCompaniesFullAnalytics();
        const headers = [
            new TableHeader([
                new HeaderCell("Заказчик", 1, 2),
                new HeaderCell("Подписание договора/ Договор заключён", 2),
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
        return new Table(headers, data);
    }
}

export async function getCompaniesFullAnalytics() {
    return AnalyticsService.getCompaniesFullAnalytics();
}