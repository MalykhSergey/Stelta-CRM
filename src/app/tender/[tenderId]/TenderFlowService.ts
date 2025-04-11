import {Tender} from "@/models/Tender/Tender";
import {showMessage} from "@/app/components/Alerts/Alert";
import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {deleteTender} from "@/models/Tender/TenderService";
import Company from "@/models/Company/Company";
import {Role, User} from "@/models/User/User";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import TenderStageStrategy from "@/app/tender/[tenderId]/TenderStrategy";

enum ActiveTenderStatus {
    Stage0 = 0,
    Stage1_1 = 1,
    Stage1_2 = 2,
    Stage2_1 = 3,
    Win = 4,
    ContractSigned = 5,
}

export default class TenderFlowService {
    private static readonly NEXT_STAGE_LABELS: Record<ActiveTenderStatus, string> = {
        [ActiveTenderStatus.Stage0]: 'Участвовать',
        [ActiveTenderStatus.Stage1_1]: 'Подать заявку',
        [ActiveTenderStatus.Stage1_2]: 'Сметный расчёт',
        [ActiveTenderStatus.Stage2_1]: 'Подать заявку',
        [ActiveTenderStatus.Win]: 'Победа',
        [ActiveTenderStatus.ContractSigned]: 'Договор подписан',
    };
    private static readonly LOOSE_BUTTON_LABELS: Partial<Record<ActiveTenderStatus, string>> = {
        [ActiveTenderStatus.Win]: 'Проиграли',
    };
    private static readonly PREV_STAGE_BUTTON_LABELS: Partial<Record<ActiveTenderStatus, string>> = {
        [ActiveTenderStatus.Stage1_2]: 'Дозапрос',
        [ActiveTenderStatus.Win]: 'Переторжка',
    };
    tender: Tender;
    companies: Company[];
    isAuth = false;
    private router: AppRouterInstance;

    constructor(tender: string, companies: string, user: User, router: AppRouterInstance) {
        this.isAuth = user.name != '' && user.role != Role.Viewer;
        this.router = router;
        this.companies = Company.fromJSONArray(companies)
        this.tender = Tender.fromJSON(tender)
        if (this.tender.company.id != 0)
            this.tender.company = this.companies.find(company => company.id === this.tender.company.id)!
    }

    async saveHandler(): Promise<boolean> {
        // Обновить контактное лицо в организациях, т.к. могло быть добавлено новое
        if ((this.tender.status == 0 || this.tender.status == 1) && this.tender.contactPerson.id == 0) {
            if (this.tender.company.id == 0) {
                showMessage("Выберите организацию!", "error")
                return false
            }
            const result = await (await fetch(`/api/contact_person?companyId=${this.tender.company.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.tender.contactPerson)
            })).json()
            if (result?.error) {
                showMessage(result.error)
                return false
            }
            showMessage("Создано новое контактное лицо!", "successful")
            this.tender.contactPerson.id = result
            const new_contact_person = new ContactPerson(this.tender.contactPerson.id, this.tender.contactPerson.name, this.tender.contactPerson.phoneNumber, this.tender.contactPerson.email)
            this.tender.company.addContactPerson(new_contact_person)
        }
        const result = await (await fetch(`/api/tender/${this.tender.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.tender)
        })).json()
        if (result?.error) {
            showMessage(result.error)
            return false;
        } else {
            showMessage("Данные успешно сохранены!", "successful")
        }
        return true;
    }

    private async updateStageHandler(stage: number) {
        const previous = this.tender.status
        this.tender.status = stage
        if (!(await this.saveHandler()))
            this.tender.status = previous
    }

    async deleteHandler() {
        const result = await deleteTender(this.tender.id)
        if (result?.error)
            showMessage(result.error)
        else
            this.router.push('/')
    }

    showStageForm(formNumber: number): boolean {
        const strategy = TenderStageStrategy.getStrategy(this.tender);
        return strategy.showStageForm(formNumber);
    };

    editableStageForm(formNumber: number): boolean {
        const strategy = TenderStageStrategy.getStrategy(this.tender);
        return strategy.isActiveStageForm(formNumber) && this.isAuth;
    }

    showNextStageButton(): boolean {
        return this.tender.status >= 0 && this.tender.status < 6;
    }

    getNextStageLabel(status: ActiveTenderStatus): string {
        return TenderFlowService.NEXT_STAGE_LABELS[status] || '';
    }

    showLooseStageButton(): boolean {
        return this.tender.status > 0 && this.tender.status < 5;
    }

    getLooseButtonLabel(status: ActiveTenderStatus): string {
        return TenderFlowService.LOOSE_BUTTON_LABELS[status] || 'Не участвуем';
    }

    showPrevStageButton(): boolean {
        return this.tender.status > 0 && this.tender.status < 6 && (this.tender.status & 1) == 0;
    }

    getPrevStageButtonLabel(status: ActiveTenderStatus): string {
        return TenderFlowService.PREV_STAGE_BUTTON_LABELS[status] || '';
    }

    looseTender() {
        const strategy = TenderStageStrategy.getStrategy(this.tender);
        this.updateStageHandler(strategy.looseStage())
    }

    nextStageTender() {
        const strategy = TenderStageStrategy.getStrategy(this.tender);
        this.updateStageHandler(strategy.nextStage())
    }

    prevStageTender() {
        const strategy = TenderStageStrategy.getStrategy(this.tender);
        this.updateStageHandler(strategy.prevStage())
    }
}