import {
    getCompaniesFullAnalytics,
    getCompaniesWinLooseAnalytics,
    getOrdersAnalytics,
    getTendersAnalytics
} from "@/models/Analytics/AnalyticsService";
import CompanyFullAnalytics from "@/models/Analytics/Table/Excel/CompanyFullAnalytics";
import CompanyWinLooseAnalytics from "@/models/Analytics/Table/Excel/CompanyWinLooseAnalytics";
import {NextRequest} from "next/server";
import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
import TendersAnalytics from "@/models/Analytics/Table/Excel/TendersAnalytics";
import OrdersAnalytics from "@/models/Analytics/Table/Excel/OrdersAnalytics";

export async function GET(request: NextRequest, {
    params,
}: {
    params: Promise<{ type: string }>
}) {
    let tableData;
    let table;
    const searchParams = request.nextUrl.searchParams
    const start_param = searchParams.get('start') as string
    const end_param = searchParams.get('end') as string
    const statuses_param = searchParams.get('statuses') as string || ''
    const statuses = statuses_param.split(',').map(value => parseInt(value))
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    let file_name;
    switch ((await params).type) {
        case "company": {
            tableData = await getCompaniesFullAnalytics(startDate, endDate, statuses, false)
            table = new CompanyFullAnalytics(tableData.headers, tableData.data, tableData.colSizes, true);
            file_name = `Аналитика по организациям ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
            break
        }
        case "win_loose": {
            tableData = await getCompaniesWinLooseAnalytics(startDate, endDate, statuses, false)
            table = new CompanyWinLooseAnalytics(tableData.headers, tableData.data, tableData.colSizes, true);
            file_name = `Аналитика победили-проиграли ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
            break
        }
        case "tenders": {
            tableData = await getTendersAnalytics(startDate, endDate, statuses, false)
            table = new TendersAnalytics(tableData.headers, tableData.data, tableData.colSizes, false);
            file_name = `Аналитика по тендерам ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
            break
        }
        case "orders": {
            const contract_number = searchParams.get('contract_number') || ''
            tableData = await getOrdersAnalytics(startDate, endDate, statuses, contract_number, false)
            table = new OrdersAnalytics(tableData.headers, tableData.data, tableData.colSizes, false);
            file_name = `Аналитика по заказам ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')} для договора ${contract_number}.xlsx`;
            break
        }
        default: {
            return new Response("Неправильный параметр пути!", {status: 403});
        }
    }
    file_name = encodeURIComponent(file_name)
    if (tableData && table) {
        return new Response(await table.render().xlsx.writeBuffer(), {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${file_name}"`,
            },
        });
    } else return new Response("Ошибка получения данных из БД!", {status: 500});
}
