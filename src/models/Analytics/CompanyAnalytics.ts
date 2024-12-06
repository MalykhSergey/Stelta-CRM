import Company from "../Company/Company";

export class CompanyAnalytics {
    constructor(public company: Company, public tenders_count: number, public tenders_price: number) {
    }
}