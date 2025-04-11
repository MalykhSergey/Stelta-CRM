import {Tender} from "@/models/Tender/Tender";
import {TenderType} from "@/models/Tender/TenderType";


export default abstract class TenderStageStrategy {
    tender: Tender;

    constructor(tender: Tender) {
        this.tender = tender;
    }

    static getStrategy(tender: Tender):TenderStageStrategy {
        switch (tender.type) {
            case TenderType.Tender:
                return new FullStageStrategy(tender);
            case TenderType.Special:
                return new FullStageStrategy(tender);
            case TenderType.Order:
                return new SkipFirstStageStrategy(tender);
            case TenderType.Offer:
                return new SkipFirstStageStrategy(tender);
        }
    }
    abstract showStageForm(formNumber: number):boolean;
    abstract isActiveStageForm(formNumber: number): boolean;

    nextStage():number{
        return this.tender.status+1
    }
    prevStage(){
        return this.tender.status-1
    }
    looseStage(){
        return -this.tender.status
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