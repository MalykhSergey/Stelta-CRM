import connection from "@/config/Database";
import {formatValue} from "react-currency-input-field";
import getStatusName from "@/models/Tender/Status";
import {getFundingTypeName} from "@/models/Tender/FundingType";

export default class AnalyticStorage {
    static async getCompaniesFullAnalytics(format: boolean = true) {
        const rows = (await connection.query(`
            SELECT
                COALESCE(companies.name, 'Общий итог') AS company_name,
                COALESCE(COUNT(*) FILTER (WHERE status >= 5), 0) AS status_high_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status >= 5), 0) AS status_high_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 1), 0) AS funding_high_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 1), 0) AS funding_high_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 0), 0) AS funding_low_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 0), 0) AS funding_low_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 2), 0) AS funding_budget_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 2), 0) AS funding_budget_sum,
                COALESCE(COUNT(*), 0) AS total_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)), 0) AS total_sum
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id
            GROUP BY ROLLUP(companies.name)
            ORDER BY companies.name NULLS LAST;`)).rows
        if (format)
            return rows.map(row => {
                row.status_high_sum = AnalyticStorage.transformNumber(row.status_high_sum || '0')
                row.funding_high_sum = AnalyticStorage.transformNumber(row.funding_high_sum || '0')
                row.funding_low_sum = AnalyticStorage.transformNumber(row.funding_low_sum || '0')
                row.funding_budget_sum = AnalyticStorage.transformNumber(row.funding_budget_sum || '0')
                row.total_sum = AnalyticStorage.transformNumber(row.total_sum || '0')
                return row;
            })
        return rows
    }

    static async getTendersAnalytics(format: boolean = true) {
        const rows = (await connection.query(`
            SELECT
                companies.name AS company_name,
                tenders.name,
                COALESCE(reb_price, tenders.price) AS price,
                TO_CHAR(date2_finish, 'DD.MM.YYYY'),
                CASE
                    WHEN status >= 5 THEN 
                        CASE status
                            WHEN 5 THEN '${getStatusName(5)}'
                            WHEN 6 THEN '${getStatusName(6)}'
                            ELSE 'Неизвестный статус'
                        END
                    ELSE 
                        CASE funding_type
                            WHEN 0 THEN '${getFundingTypeName(0)}'
                            WHEN 1 THEN '${getFundingTypeName(1)}'
                            WHEN 2 THEN '${getFundingTypeName(2)}'
                            ELSE 'Другой'
                        END
                END AS custom_status
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id;`)).rows
        if (format)
            return rows
                .map(row => {
                    row.price = AnalyticStorage.transformNumber(row.price)
                    return row
                })
        return rows
    }

    static async getCompaniesWinLooseAnalytics(format: boolean = true) {
        const rows = (await connection.query(`
            SELECT
                COALESCE(companies.name, 'Общий итог') AS company_name,
                COALESCE(COUNT(*) FILTER (WHERE status >= 5), 0) AS win_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status >= 5), 0) AS win_sum,
                COALESCE(COUNT(*) FILTER (WHERE status <= -4), 0) AS loose_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status <= -4), 0) AS loose_sum
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id
            GROUP BY ROLLUP(companies.name)
            ORDER BY companies.name NULLS LAST;`)).rows
        if (format)
            return rows.map(row => {
                row.win_sum = AnalyticStorage.transformNumber(row.win_sum)
                row.loose_sum = AnalyticStorage.transformNumber(row.loose_sum)
                return row
            })
        return rows
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