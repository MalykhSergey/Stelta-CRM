import { StatusAnalytics } from "@/models/Analytics/StatusAnalytics";

export class CumulativeStatusAnalytics extends StatusAnalytics {
    cumulative_status_price: number[] = [0, 0, 0, 0, 0, 0]
    status_counts_history: CountInDate[][] = [[],[],[],[],[],[],[]]
}

export class CountInDate {
    constructor(public date: number, public count: number, public cumulative_count: number) {}
}