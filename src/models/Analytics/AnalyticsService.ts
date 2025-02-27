"use server"
import { CountInDate, CumulativeStatusAnalytics } from "@/models/Analytics/CumulativeStatusAnalytics"
import getStatusName from "../Tender/Status"
import {
    loadCommonAnalytics,
    loadCompanyAnalyticsByStatus,
    loadCumulativeAnalyticsByDate,
    loadStatusAnalyticsByCompany,
    loadStatusAnalyticsByDate
} from "./AnalyticsStorage"
import { CommonAnalytics } from "./CommonAnalytics"
import { CompanyAnalyticsDTO } from "./CompanyAnalytics"
import { StatusAnalytics } from "./StatusAnalytics"

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
    return { ...analytics }
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
    return { ...analytics };
}

export async function getStatusAnalyticsByDateRange(startDate: string, endDate: string) {
    const result = await loadStatusAnalyticsByDate(startDate, endDate)
    const analytics = new CumulativeStatusAnalytics()
    for (const row of result) {
        if (row.is_special) {
            analytics.special_count += row.count
            analytics.special_price += Number.parseFloat(row.sum)
        } else {
            const statusName = getStatusName(row.status)
            analytics.status_counts[statusName] = (analytics.status_counts[statusName] || 0) + row.count
            const abs_status = row.status;
            analytics.cumulative_status_price[abs_status] = (analytics.cumulative_status_price[abs_status] || 0) + row.count
            analytics.status_price[statusName] = (analytics.status_price[statusName] || 0) + Number.parseFloat(row.sum)
        }
    }
    for (let i = analytics.cumulative_status_price.length - 2; i != -1; i--) {
        analytics.cumulative_status_price[i] += analytics.cumulative_status_price[i + 1]
    }
    const cfd_result = await loadCumulativeAnalyticsByDate(startDate, endDate)
    for (const row of cfd_result) {
        analytics.dates_status_counts[row.status].push({ ... new CountInDate(parseInt(row.date_time), parseInt(row.count_tenders)) })
    }
    return { ...analytics }
}

export async function getCompanyAnalyticsByStatus(status: number) {
    const result = await loadCompanyAnalyticsByStatus(status)
    const analytics_list = []
    for (const row of result) {
        analytics_list.push({ ...new CompanyAnalyticsDTO({ id: row.id, name: row.name, contactPersons: [] }, row.count, Number.parseFloat(row.sum)) })
    }
    return analytics_list
}