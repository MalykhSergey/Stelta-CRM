import connection from "@/config/Database";
import {formatValue} from "react-currency-input-field";

export default class AnalyticStorage {
    static async getCompaniesFullAnalytics() {
        const rows = (await connection.query(`
            SELECT
                COALESCE(companies.name, 'Общий итог') AS company_name,
                COUNT(*) FILTER (WHERE status >= 5) AS status_high_count,
                (SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status >= 5))::numeric AS status_high_sum,
                COUNT(*) FILTER (WHERE status < 5 AND funding_type = 1) AS funding_high_count,
                SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 1) AS funding_high_sum,
                COUNT(*) FILTER (WHERE status < 5 AND funding_type = 0) AS funding_low_count,
                SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 0) AS funding_low_sum,
                COUNT(*) FILTER (WHERE status < 5 AND funding_type = 2) AS funding_budget_count,
                SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 2) AS funding_budget_sum,
                COUNT(*) AS total_count,
                SUM(COALESCE(reb_price, tenders.price)) AS total_sum
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id
            GROUP BY ROLLUP(companies.name);`)).rows
        return rows.map(row => {
            row.status_high_sum = AnalyticStorage.transformNumber(row.status_high_sum || '0')
            row.funding_high_sum = AnalyticStorage.transformNumber(row.funding_high_sum || '0')
            row.funding_low_sum = AnalyticStorage.transformNumber(row.funding_low_sum || '0')
            row.funding_budget_sum = AnalyticStorage.transformNumber(row.funding_budget_sum || '0')
            row.total_sum = AnalyticStorage.transformNumber(row.total_sum || '0')
            return row
        })
    }

    private static transformNumber(value: string) {
        return formatValue({
            value: value,
            suffix: '₽',
            groupSeparator: ' ',
            decimalSeparator: ','
        })
    }
}