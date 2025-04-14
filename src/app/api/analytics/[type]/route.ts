import {
    getCompaniesFullAnalytics,
    getCompaniesWinLooseAnalytics,
    getTendersAnalytics
} from "@/models/Analytics/AnalyticsService";
import CompanyFullAnalytics from "@/models/Analytics/Table/Excel/CompanyFullAnalytics";
import CompanyWinLooseAnalytics from "@/models/Analytics/Table/Excel/CompanyWinLooseAnalytics";

export async function GET(
    request: Request,
    {params}: { params: { type: string } }
) {
    let tableData;
    let table;

    switch (params.type) {
        case "company": {
            tableData = await getCompaniesFullAnalytics(false)
            table = new CompanyFullAnalytics(tableData.headers, tableData.data, tableData.colSizes);
            break
        }
        case "win_loose": {
            tableData = await getCompaniesWinLooseAnalytics(false)
            table = new CompanyWinLooseAnalytics(tableData.headers, tableData.data, tableData.colSizes);
            break
        }
        case "tenders": {
            tableData = await getCompaniesWinLooseAnalytics(false)
            break
        }
        default: {
            return new Response("Неправильный параметр пути!", {status: 403});
        }
    }
    if (tableData&&table) {
        return new Response(await table.render().xlsx.writeBuffer(), {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": 'attachment; filename="analytics.xlsx"',
            },
        });
    } else return new Response("Ошибка получения данных из БД!", {status: 500});
}
