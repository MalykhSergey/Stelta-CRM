"use server"
import {CompanyDTO} from "../Company/Company"
import getStatusName from "../Tender/Status"
import {
    loadCommonAnalytics,
    loadCompanyAnalyticsByStatus,
    loadStatusAnalyticsByCompany,
    loadStatusAnalyticsByDate
} from "./AnalyticsStorage"
import {CommonAnalytics} from "./CommonAnalytics"
import {CompanyAnalyticsDTO} from "./CompanyAnalytics"
import {StatusAnalytics} from "./StatusAnalytics"

export async function getCommonAnalytics() {
    const result = await loadCommonAnalytics()
    const analytics = new CommonAnalytics()
    for (const row of result) {
        if (row.is_special) {
            analytics.special_count += row.count
            analytics.special_price += Number.parseFloat(row.sum)
        } else if (row.status == 6) {
            analytics.win_count = row.count
            analytics.win_price = Number.parseFloat(row.sum)
        } else if (row.status == -4) {
            analytics.loose_count = row.count
            analytics.loose_price = Number.parseFloat(row.sum)
        } else if (row.status < 0) {
            analytics.not_participate_count += row.count
            analytics.not_participate_price += Number.parseFloat(row.sum)
        }
    }
    return {...analytics}
}

export async function getStatusAnalyticsByCompany(company_id: number) {
    const result = await loadStatusAnalyticsByCompany(company_id)
    const analytics = new StatusAnalytics()
    for (const row of result) {
        if (row.is_special) {
            analytics.special_count += row.count
            analytics.special_price += Number.parseFloat(row.sum)
        } else {
            const statusName = getStatusName(row.status)
            analytics.status_counts[statusName] = (analytics.status_counts[statusName] || 0) + row.count
            analytics.status_price[statusName] = (analytics.status_price[statusName] || 0) + Number.parseFloat(row.sum)
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
            analytics.special_price += Number.parseFloat(row.sum)
        } else {
            const statusName = getStatusName(row.status)
            analytics.status_counts[statusName] = (analytics.status_counts[statusName] || 0) + row.count
            analytics.status_price[statusName] = (analytics.status_price[statusName] || 0) + Number.parseFloat(row.sum)
        }
    }
    return {...analytics}
}

export async function getCompanyAnalyticsByStatus(status: number) {
    const result = await loadCompanyAnalyticsByStatus(status)
    const analytics_list = []
    for (const row of result) {
        analytics_list.push({...new CompanyAnalyticsDTO({...new CompanyDTO(row.id, row.name)}, row.count, Number.parseFloat(row.sum))})
    }
    return analytics_list
}