import connection from "@/config/Database";
import {formatValue} from "react-currency-input-field";
import {getFundingTypeName} from "@/models/Tender/FundingType";

export default class AnalyticStorage {
    static async getCompaniesFullAnalytics(startDate: Date, endDate: Date, format: boolean) {
        const rows = (await connection.query(`
            SELECT
                COALESCE(companies.name, 'Общий итог') AS company_name,
                COALESCE(COUNT(*) FILTER (WHERE status >= 5), 0)${format?'':'::int'} AS status_high_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status >= 5), 0)${format?'':'::float'} AS status_high_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 1), 0)${format?'':'::int'} AS funding_high_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 1), 0)${format?'':'::float'} AS funding_high_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 0), 0)${format?'':'::int'} AS funding_low_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 0), 0)${format?'':'::float'} AS funding_low_sum,
                COALESCE(COUNT(*) FILTER (WHERE status < 5 AND funding_type = 2), 0)${format?'':'::int'} AS funding_budget_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status < 5 AND funding_type = 2), 0)${format?'':'::float'} AS funding_budget_sum,
                COALESCE(COUNT(*), 0)${format?'':'::int'} AS total_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)), 0)${format?'':'::float'} AS total_sum
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id
            WHERE date1_start >= $1 and date1_start <= $2
            GROUP BY ROLLUP(companies.name)
            ORDER BY companies.name NULLS LAST;`
            , [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])).rows
        if (format) {
            return rows.map(row => {
                row.status_high_sum = AnalyticStorage.transformNumber(row.status_high_sum)
                row.funding_high_sum = AnalyticStorage.transformNumber(row.funding_high_sum)
                row.funding_low_sum = AnalyticStorage.transformNumber(row.funding_low_sum)
                row.funding_budget_sum = AnalyticStorage.transformNumber(row.funding_budget_sum)
                row.total_sum = AnalyticStorage.transformNumber(row.total_sum)
                return row;
            })
        }
        return rows
    }

    static async getTendersAnalytics(startDate: Date, endDate: Date, format: boolean) {
        const rows = (await connection.query(`
            SELECT
                companies.name AS company_name,
                tenders.name,
                COALESCE(reb_price, tenders.price)${format?'':'::float'} AS price,
                CASE WHEN date2_finish > date1_start THEN TO_CHAR(date2_finish, 'DD.MM.YYYY') ELSE '' END,
                CASE
                    WHEN status >= 5 THEN 'Подписание договора / Договор подписан'
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
            JOIN public.companies ON tenders.company_id = companies.id
            WHERE date1_start >= $1 and date1_start <= $2
            ORDER BY CASE WHEN status >= 5 THEN 0 ELSE 1 END, funding_type desc;`, [startDate, endDate])).rows
        if (format)
            return rows
                .map(row => {
                    row.price = AnalyticStorage.transformNumber(row.price)
                    return row
                })
        return rows
    }

    static async getCompaniesWinLooseAnalytics(startDate: Date, endDate: Date, format: boolean) {
        const rows = (await connection.query(`
        SELECT
                COALESCE(companies.name, 'Общий итог') AS company_name,
                COALESCE(COUNT(*) FILTER (WHERE status >= 5), 0)${format ? '' : '::int'} AS win_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status >= 5), 0)${format ? '' : '::float'} AS win_sum,
                COALESCE(COUNT(*) FILTER (WHERE status <= -4), 0)${format ? '' : '::int'} AS loose_count,
                COALESCE(SUM(COALESCE(reb_price, tenders.price)) FILTER (WHERE status <= -4), 0)${format ? '' : '::float'} AS loose_sum
            FROM public.tenders
            LEFT JOIN (
                SELECT DISTINCT ON (tender_id) tender_id, price AS reb_price
                FROM rebidding_prices
                ORDER BY tender_id, id DESC
                ) AS reb_prices ON reb_prices.tender_id = tenders.id
            JOIN public.companies ON tenders.company_id = companies.id
            WHERE date1_start >= $1 and date1_start <= $2
            GROUP BY ROLLUP(companies.name)
            ORDER BY companies.name NULLS LAST;`, [startDate, endDate])).rows
        if (format) {
            return rows.map(row => {
                row.win_sum = AnalyticStorage.transformNumber(row.win_sum)
                row.loose_sum = AnalyticStorage.transformNumber(row.loose_sum)
                return row
            })
        }
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