import {NextResponse} from "next/server";
import {getCompaniesFullAnalytics} from "@/models/Analytics/AnalyticsService";
import CompanyAnalytics from "@/models/Analytics/Table/Excel/CompanyAnalytics";

export async function GET(
    request: Request,
    {params}: { params: { type: string } }
) {
    const tableData = await getCompaniesFullAnalytics(false);
    if (!tableData) {
        return NextResponse.json(
            {error: "Данные таблицы не найдены"},
            {status: 404}
        );
    }

    const table = new CompanyAnalytics(tableData.headers, tableData.data, tableData.colSizes);
    return new Response(await table.render().xlsx.writeBuffer(), {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="analytics.xlsx"',
        },
    });
}
