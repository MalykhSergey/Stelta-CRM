import Company, {CompanyDTO} from "../Company/Company";

export class CompanyAnalyticsDTO {
    constructor(public company: CompanyDTO, public tenders_count: number, public tenders_price: number) {
    }
}

export class CompanyAnalytics extends CompanyAnalyticsDTO{
    constructor(public company: Company, public tenders_count: number, public tenders_price: number) {
        super(company, tenders_count, tenders_price);
    }
}