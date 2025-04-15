import {
    getCompaniesFullAnalytics,
    getCompaniesWinLooseAnalytics,
    getTendersAnalytics
} from "@/models/Analytics/AnalyticsService";
import CompanyFullAnalytics from "@/models/Analytics/Table/Excel/CompanyFullAnalytics";
import CompanyWinLooseAnalytics from "@/models/Analytics/Table/Excel/CompanyWinLooseAnalytics";
import {NextRequest} from "next/server";
import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";
import TendersAnalytics from "@/models/Analytics/Table/Excel/TendersAnalytics";

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
    const {startDate, endDate} = getParamsDates(start_param, end_param)
    let file_name;
    switch ((await params).type) {
        case "company": {
            tableData = await getCompaniesFullAnalytics(startDate, endDate, false)
            table = new CompanyFullAnalytics(tableData.headers, tableData.data, tableData.colSizes, true);
            file_name = `Аналитика по организациям ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
            break
        }
        case "win_loose": {
            tableData = await getCompaniesWinLooseAnalytics(startDate, endDate, false)
            table = new CompanyWinLooseAnalytics(tableData.headers, tableData.data, tableData.colSizes, true);
            file_name = `Аналитика победили-проиграли ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
            break
        }
        case "tenders": {
            tableData = await getTendersAnalytics(startDate, endDate, false)
            table = new TendersAnalytics(tableData.headers, tableData.data, tableData.colSizes, false);
            file_name = `Аналитика по тендерам ${startDate.toLocaleDateString('ru')}-${endDate.toLocaleDateString('ru')}.xlsx`;
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
