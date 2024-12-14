"use server"
import connection from "../../config/Database";

export async function loadCommonAnalytics() {
    return (await connection.query(`SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(tenders.price)::numeric FROM tenders GROUP BY status, is_special`)).rows
}

export async function loadStatusAnalyticsByCompany(company_id: number) {
    return (await connection.query(`SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(tenders.price)::numeric FROM tenders WHERE company_id = $1 GROUP BY status, is_special`, [company_id])).rows
}

export async function loadStatusAnalyticsByDate(start_date: string, finish_date: string) {
    return (await connection.query(`
        SELECT status, CAST(count(tenders.id) AS INTEGER) AS count, is_special, sum(tenders.price)::numeric 
        FROM tenders 
        WHERE 
            (date1_start >= $1::timestamp AND date1_start <= $2::timestamp OR 
             date1_finish >= $1::timestamp AND date1_finish <= $2::timestamp OR 
             date2_finish >= $1::timestamp AND date2_finish <= $2::timestamp OR 
             date_finish >= $1::timestamp AND date_finish <= $2::timestamp)
        GROUP BY status, is_special;
`, [start_date, finish_date])).rows
}

export async function loadCompanyAnalyticsByStatus(status: number) {
    if (status == -1)
        return (await connection.query(`
        SELECT companies.id, companies.name, CAST(count(tenders.id) AS INTEGER) AS count, sum(tenders.price)::numeric FROM tenders 
        JOIN companies ON tenders.company_id = companies.id 
        WHERE status != -4 AND status < 0
        GROUP BY companies.id, companies.name `)).rows
    else
        return (await connection.query(`
        SELECT companies.id, companies.name, CAST(count(tenders.id) AS INTEGER) AS count, sum(tenders.price)::numeric FROM tenders 
        JOIN companies ON tenders.company_id = companies.id 
        WHERE status = $1
        GROUP BY companies.id, companies.name `, [status])).rows
}