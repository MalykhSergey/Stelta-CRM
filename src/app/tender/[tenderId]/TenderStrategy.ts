import {Tender} from "@/models/Tender/Tender";
import {TenderType} from "@/models/Tender/TenderType";
import {FundingType} from "@/models/Tender/FundingType";


export default abstract class TenderStageStrategy {
    tender: Tender;

    constructor(tender: Tender) {
        this.tender = tender;
    }

    static getStrategy(tender: Tender): TenderStageStrategy {
        switch (tender.type) {
            case TenderType.Tender:
                return new FullStageStrategy(tender);
            case TenderType.Special:
                return new FullStageStrategy(tender);
            case TenderType.Order:
                return new SkipFirstStageStrategy(tender);
            case TenderType.Offer:
                return new OfferStrategy(tender);
        }
    }

    abstract showStageForm(formNumber: number): boolean;

    abstract isActiveStageForm(formNumber: number): boolean;

    nextStage(): number {
        return this.tender.status + 1
    }

    prevStage() {
        return this.tender.status - 1
    }

    looseStage() {
        return -this.tender.status
    }

    public isEditable(isAuth: boolean) {
        let isEditable = {
            type: false,
            status: isAuth,
            fundingType: isAuth,
            isSpecial: false,
            company: false,
            name: false,
            shortName: isAuth,
            regNumber: false,
            parentContract: false,
            lotNumber: false,
            initialMaxPrice: false,
            price: false,
            date1_start: false,
            date1_finish: false,
            date2_finish: false,
            date_finish: false,
            contactPerson: false,
            phoneNumber: false,
            email: false,
        };
        if (isAuth && this.tender.status >= 0) {
            if (this.tender.status == 0) isEditable = {
                type: isAuth,
                status: true,
                fundingType: isAuth,
                isSpecial: true,
                company: true,
                name: true,
                shortName: true,
                regNumber: true,
                parentContract: true,
                lotNumber: true,
                initialMaxPrice: true,
                price: true,
                date1_start: true,
                date1_finish: true,
                date2_finish: true,
                date_finish: true,
                contactPerson: true,
                phoneNumber: true,
                email: true,
            };
            if (this.tender.status <= 2) isEditable.date1_finish = true
            if (this.tender.status <= 3) isEditable.date2_finish = true
            if (this.tender.status <= 4) isEditable.date_finish = true
        }
        return isEditable;
    }
}

class FullStageStrategy extends TenderStageStrategy {
    private static stageConfig = [0, 1, 3, 5];

    showStageForm(formNumber: number): boolean {
        return Math.abs(this.tender.status) >= FullStageStrategy.stageConfig[formNumber];
    };

    isActiveStageForm(formNumber: number): boolean {
        return Math.abs(this.tender.status) == FullStageStrategy.stageConfig[formNumber];
    }
}

class SkipFirstStageStrategy extends TenderStageStrategy {
    private static stageConfig = [0, 1, 3, 5];

    showStageForm(formNumber: number): boolean {
        if (formNumber == 1) return false;
        return Math.abs(this.tender.status) >= SkipFirstStageStrategy.stageConfig[formNumber];
    };

    isActiveStageForm(formNumber: number): boolean {
        return Math.abs(this.tender.status) == SkipFirstStageStrategy.stageConfig[formNumber];
    }

    nextStage(): number {
        if (this.tender.status == 0) return 3;
        return super.nextStage()
    }
}

class OfferStrategy extends SkipFirstStageStrategy {
    constructor(tender: Tender) {
        super(tender);
        this.tender.fundingType = FundingType.Budget;
    }

    isEditable(isAuth: boolean): {
        initialMaxPrice: boolean;
        date1_finish: boolean;
        date2_finish: boolean;
        contactPerson: boolean;
        lotNumber: boolean;
        type: boolean;
        regNumber: boolean;
        parentContract: boolean,
        phoneNumber: boolean;
        fundingType: boolean;
        isSpecial: boolean;
        price: boolean;
        name: boolean;
        date_finish: boolean;
        company: boolean;
        shortName: boolean;
        date1_start: boolean;
        email: boolean;
        status: boolean
    } {
        const isEditable = super.isEditable(isAuth);
        isEditable.fundingType = false;
        return isEditable;
    }
}