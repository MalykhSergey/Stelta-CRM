'use client';

import {PrimaryButton} from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import CommentsForm from '@/app/tender/CommentsForm/CommentsForm';
import StageForm1 from '@/app/tender/StageForm1/StageForm1';
import StageForm2 from '@/app/tender/StageForm2/StageForm2';
import StageForm3 from '@/app/tender/StageForm3/StageForm3';
import TenderForm from '@/app/tender/TenderForm/TenderForm';
import {observer, useLocalObservable} from 'mobx-react-lite';
import styles from "./TenderPageClient.module.css";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import TenderFlowService from "@/app/tender/[tenderId]/TenderFlowService";
import {useAuth} from "@/app/AuthContext";
import {useRouter} from "next/navigation";
import ParentContract from "@/models/Tender/ParentContract";

const TenderPageClient = observer((props: { tender: string, companies: string, parent_contacts: ParentContract[] }) => {
    const user = useAuth().user;
    const router = useRouter();
    const tenderFlowService = useLocalObservable(() => new TenderFlowService(props.tender, props.companies, props.parent_contacts, user, router));
    const tender = tenderFlowService.tender;
    const isEditable = tenderFlowService.isEditable();

    return (<div id={styles.content}>
        <div id={styles.leftPanel}>
            <TenderForm tenderFlowService={tenderFlowService}/>
        </div>
        <div id={styles.rightPanel}>
            <DocumentsForm title='Документы тендера' tenderId={tender.id} fileNames={tender.stagedFileNames[0]}
                           specialPlaceName={'stage'} specialPlaceId={0}
                           isEditable={tenderFlowService.editableStageForm(0)}
                           isOpened={isEditable.company}/>
            {tenderFlowService.showStageForm(1) &&
                <StageForm1 tender={tender} isEditable={tenderFlowService.editableStageForm(1)}/>}
            {tenderFlowService.showStageForm(2) &&
                <StageForm2 tender={tender} isEditable={tenderFlowService.editableStageForm(2)}/>}
            {tenderFlowService.showStageForm(3) &&
                <StageForm3 tender={tender} isEditable={tenderFlowService.editableStageForm(3)}/>}
            <CommentsForm tender={tender}/>
            {tenderFlowService.isAuth && <div className={styles.buttonRow}>
                {tenderFlowService.showPrevStageButton() && <button className='OrangeButton'
                                                                    onClick={() => tenderFlowService.prevStageTender()}>{tenderFlowService.getPrevStageButtonLabel(tender.status)}</button>}
                {tenderFlowService.showNextStageButton() && <button className='GreenButton'
                                                                    onClick={() => tenderFlowService.nextStageTender()}>{tenderFlowService.getNextStageLabel(tender.status)}</button>}
                <PrimaryButton onClick={() => tenderFlowService.saveHandler()}>Сохранить</PrimaryButton>
                {tender.status == 0 && <button className='RedButton'
                                               onClick={() => tenderFlowService.deleteHandler()}>Удалить</button>}
                {tenderFlowService.showLooseStageButton() &&
                    <button className='RedButton'
                            onClick={() => tenderFlowService.looseTender()}>{tenderFlowService.getLooseButtonLabel(tender.status)}</button>}
            </div>}
        </div>
    </div>);
});
export default TenderPageClient;
