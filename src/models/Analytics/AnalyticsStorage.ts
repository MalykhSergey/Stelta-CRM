"use server"
import connection from "../../config/Database";

export async function loadCommonAnalytics() {
    return (await connection.query(`
        SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(COALESCE(reb_price, tenders.price))::numeric
        FROM tenders
        LEFT JOIN (
            SELECT DISTINCT ON (tender_id) 
                tender_id, 
                price AS reb_price
            FROM rebidding_prices
            ORDER BY tender_id, id DESC
        ) AS reb_prices ON reb_prices.tender_id = tenders.id
        GROUP BY status, is_special`)).rows
}

export async function loadStatusAnalyticsByCompany(company_id: number) {
    return (await connection.query(`
        SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(COALESCE(reb_price, tenders.price))::numeric 
        FROM tenders 
        LEFT JOIN (
            SELECT DISTINCT ON (tender_id) 
                tender_id, 
                price AS reb_price
            FROM rebidding_prices
            ORDER BY tender_id, id DESC
        ) AS reb_prices ON reb_prices.tender_id = tenders.id
        WHERE company_id = $1 
        GROUP BY status, is_special`, [company_id])).rows
}

export async function loadStatusAnalyticsByDate(start_date: string, finish_date: string) {
    return (await connection.query(`
        SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(COALESCE(reb_price, tenders.price))::numeric
        FROM tenders 
        LEFT JOIN (
            SELECT DISTINCT ON (tender_id) 
                tender_id, 
                price AS reb_price
            FROM rebidding_prices
            ORDER BY tender_id, id DESC
        ) AS reb_prices ON reb_prices.tender_id = tenders.id
        WHERE 
            (date1_start >= $1::timestamp AND date1_start <= $2::timestamp) OR 
             (date1_finish >= $1::timestamp AND date1_finish <= $2::timestamp) OR 
             (date2_finish >= $1::timestamp AND date2_finish <= $2::timestamp) OR 
             (date_finish >= $1::timestamp AND date_finish <= $2::timestamp)
        GROUP BY status, is_special;
`, [start_date, finish_date])).rows
}

export async function loadCumulativeAnalyticsByDate(start_date: string, finish_date: string) {
    return (await connection.query(`
    WITH date_series AS (
        SELECT generate_series($1::date, $2::date, '1 week') AS report_date
    ),
    tender_status AS (
        SELECT 
            t.report_date,
            h.status,
            COUNT(DISTINCT h.tender_id) AS count_tenders
        FROM date_series t
        LEFT JOIN LATERAL (
            SELECT DISTINCT ON (tender_id) tender_id, status
            FROM tender_status_history
            WHERE changed_at::date <= t.report_date
            ORDER BY tender_id, changed_at DESC
        ) h ON true
        GROUP BY t.report_date, h.status
        ORDER BY t.report_date, h.status
    )
    SELECT 
        CAST (EXTRACT (EPOCH FROM report_date) * 1000 AS bigint) AS date_time,
        status,
        SUM(count_tenders) AS count_tenders
    FROM tender_status
    WHERE count_tenders > 0
    GROUP BY report_date, status
    ORDER BY report_date, status;`, [start_date, finish_date])).rows
}

export async function loadCompanyAnalyticsByStatus(status: number) {
    if (status == -1)
        return (await connection.query(`
        SELECT companies.id, companies.name, CAST(count(tenders.id) AS INTEGER) AS count, sum(COALESCE(reb_price, tenders.price))::numeric
        FROM tenders 
        JOIN companies ON tenders.company_id = companies.id 
        LEFT JOIN (
            SELECT DISTINCT ON (tender_id) 
                tender_id, 
                price AS reb_price
            FROM rebidding_prices
            ORDER BY tender_id, id DESC
        ) AS reb_prices ON reb_prices.tender_id = tenders.id
        WHERE status != -4 AND status < 0
        GROUP BY companies.id, companies.name `)).rows
    else
        return (await connection.query(`
        SELECT companies.id, companies.name, CAST(count(tenders.id) AS INTEGER) AS count, sum(COALESCE(reb_price, tenders.price))::numeric
        FROM tenders 
        JOIN companies ON tenders.company_id = companies.id 
        LEFT JOIN (
            SELECT DISTINCT ON (tender_id) 
                tender_id, 
                price AS reb_price
            FROM rebidding_prices
            ORDER BY tender_id, id DESC
        ) AS reb_prices ON reb_prices.tender_id = tenders.id
        WHERE status = $1
        GROUP BY companies.id, companies.name `, [status])).rows
}