"use server"
import Company from "../Company"
import getStatusName from "../Status"
import { loadCommonAnalytics, loadCompanyAnalyticsByStatus, loadStatusAnalyticsByCompany, loadStatusAnalyticsByDate } from "./AnalyticsStorage"
import { CommonAnalytics } from "./CommonAnalytics"
import { CompanyAnalytics } from "./CompanyAnalytics"
import { StatusAnalytics } from "./StatusAnalytics"

export async function getCommonAnalytics() {
    const result = await loadCommonAnalytics()
    const analytics = new CommonAnalytics()
    for (const row of result) {
        if (row.is_special)
            analytics.special_count += row.count
        else if (row.status == 6)
            analytics.win_count += row.count
        else if (row.status == -4)
            analytics.loose_count += row.count
        else if (row.status < 0)
            analytics.not_participate_count += row.count
    }
    return analytics
}

export async function getStatusAnalyticsByCompany(company_id: number) {
    const result = await loadStatusAnalyticsByCompany(company_id)
    const analytics = new StatusAnalytics()
    for (const row of result) {
        if (row.is_special) {
            analytics.special_count += row.count
        }
        else {
            const statusName = getStatusName(row.status)
            analytics.statuses[statusName] = (analytics.statuses[statusName] || 0) + row.count
        }
    }
    return {...analytics};
}

export async function getStatusAnalyticsByDateRange(startDate: string, endDate: string) {
    const result = await loadStatusAnalyticsByDate(startDate, endDate)
    const analytics = new StatusAnalytics()
    for (const row of result) {
        if (row.is_special) {
            analytics.special_count += row.count
        } else {
            const statusName = getStatusName(row.status)
            analytics.statuses[statusName] = (analytics.statuses[statusName] || 0) + row.count
        }
    }
    return {...analytics}
}

export async function getCompanyAnalyticsByStatus(status: number) {
    const result = await loadCompanyAnalyticsByStatus(status)
    const analytics_list = []
    for (const row of result) {
        analytics_list.push({... new CompanyAnalytics({... new Company(row.id, row.name)}, row.count)})
    }
    return analytics_list
}