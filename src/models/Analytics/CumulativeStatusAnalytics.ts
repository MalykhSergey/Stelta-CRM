import { StatusAnalytics } from "@/models/Analytics/StatusAnalytics";

export class CumulativeStatusAnalytics extends StatusAnalytics {
    cumulative_status_price: number[] = [0, 0, 0, 0, 0, 0]
    dates_status_counts: CountInDate[][] = [[],[],[],[],[],[],[]]
}

export class CountInDate {

    constructor(public date: number, public count: number){}
}