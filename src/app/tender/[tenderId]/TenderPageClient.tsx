'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentsForm';
import { showError } from '@/app/components/Error/Error';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import FileName from '@/app/models/FileName';
import { Tender } from '@/app/models/Tender';
import { deleteTender, updateTenderById } from '@/app/models/TenderService';
import StageForm1 from '@/app/tender/StageForm1/StageForm1';
import StageForm2 from '@/app/tender/StageForm2/StageForm2';
import StageForm3 from '@/app/tender/StageForm3/StageForm3';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import styles from "./TenderPageClient.module.css";
import Company from '@/app/models/Company';

const getNextStageButtonText = (status: number) => {
    switch (status) {
        case 0: return 'Участвовать';
        case 1: return 'Подать заявку';
        case 2: return 'Сметный расчёт';
        case 3: return 'Подать заявку';
        case 4: return 'Победа';
        case 5: return 'Договор подписан';
        default: return '';
    }
};
const getPreviousStageButtonText = (status: number) => {
    switch (status) {
        case 2: return 'Дозапрос';
        case 4: return 'Переторжка';
        default: return '';
    }
};
const getLooseButtonText = (status: number) => {
    switch (status) {
        case 4: return 'Проиграли';
        default: return 'Не участвуем';
    }
};

const TenderPageClient = observer(({ tender, companies }: { tender: Tender, companies:Company[] }) => {
    const router = useRouter()
    let isEditable = {
        company: false,
        name: false,
        regNumber: false,
        lotNumber: false,
        initialMaxPrice: false,
        price: false,
        date1_start: false,
        date1_finish: false,
        date2_finish: false,
        contactPerson: false,
        phoneNumber: false,
        email: false,
    };
    if (tender.status == 0)
        isEditable = {
            company: true,
            name: true,
            regNumber: true,
            lotNumber: true,
            initialMaxPrice: true,
            price: true,
            date1_start: true,
            date1_finish: true,
            date2_finish: true,
            contactPerson: true,
            phoneNumber: true,
            email: true,
        };
    if (tender.status <= 2)
        isEditable.date1_finish = true
    else if (tender.status <= 3)
        isEditable.date2_finish = true
    const updateStageHandler = async (stage: number) => {
        const result = await updateTenderById(JSON.stringify(tender))
        if (result?.error)
            showError(result.error)
        else
            tender.status = stage;
    }
    const deleteHandler = async () => {
        const result = await deleteTender(tender.id)
        if (result?.error)
            showError(result.error)
        else
            router.push('/')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
            <div style={{}}>
                <TenderForm tender={tender} companies={companies} isEditable={isEditable} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '800px' }}>
                <DocumentsForm tenderId={tender.id} stage={0} fileNames={tender.stagedFileNames[0]}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 0)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 0)}
                    title='Документы тендера' isEditable={tender.status == 0} className='card' />
                {tender.status >= 1 && <StageForm1 tender={tender} />}
                {tender.status >= 3 && <StageForm2 tender={tender} />}
                {tender.status >= 5 && <StageForm3 tender={tender} />}
                <CommentsForm tender={tender} />
                <div className={styles.buttonRow}>
                    {(tender.status > 0 && tender.status < 6 && (tender.status & 1) == 0) && <button className='PreviousStageButton' onClick={() => updateStageHandler(tender.status - 1)}>{getPreviousStageButtonText(tender.status)}</button>}
                    {tender.status >= 0 && tender.status < 6 && <button className='NextStageButton' onClick={() => updateStageHandler(tender.status + 1)}>{getNextStageButtonText(tender.status)}</button>}
                    <button className='SaveButton' onClick={() => { updateTenderById(JSON.stringify(tender)) }}>Сохранить</button>
                    {tender.status == 0 && <button className='DeleteButton' onClick={() => deleteHandler()}>Удалить</button>}
                    {tender.status > 0 && tender.status < 6 && <button className='DeleteButton' onClick={() => updateStageHandler(-tender.status)}>{getLooseButtonText(tender.status)}</button>}
                </div>
            </div>
        </div>
    );
});
export default TenderPageClient;
