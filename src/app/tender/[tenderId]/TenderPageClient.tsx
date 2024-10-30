'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import RebiddingPriceForm from '@/app/components/RebiddingPriceForm/RebiddingPriceForm';
import StageForm1 from '@/app/components/StageForm1/StageForm1';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import FileName from '@/app/models/FileName';
import { Tender } from '@/app/models/Tender';
import { updateTenderById } from '@/app/models/TenderService';
import { observer } from 'mobx-react-lite';
import styles from "./TenderPageClient.module.css";

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

const TenderPageClient = observer(({ tender }: { tender: Tender }) => {
    const isEditable = {
        company: true,
        name: true,
        regNumber: true,
        lotNumber: true,
        initialMaxPrice: true,
        price: true,
        dates: true,
        contactPerson: true,
        phoneNumber: true,
        email: true,
    };
    const nextStageHandler = (stage: number) => {
        tender.status = stage;
        updateTenderById(JSON.stringify(tender))
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
            <div style={{}}>
                <TenderForm tender={tender} isEditable={isEditable} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', width: '800px' }}>
                <DocumentsForm tenderId={tender.id} stage={0} fileNames={tender.stagedFileNames[0]}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 0)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 0)}
                    title='Документы тендера' isEditable={true} className='card'/>
                {tender.status == 1 && <StageForm1 tender={tender} isDone={false} />}
                {tender.status > 1 && <StageForm1 tender={tender} isDone={true} />}
                {tender.status == 3 && <RebiddingPriceForm tender={tender} isDone={false} />}
                {tender.status > 3 && <RebiddingPriceForm tender={tender} isDone={true} />}
                <CommentsForm tender={tender} />
                <div className={styles.buttonRow}>
                    <button onClick={() => { updateTenderById(JSON.stringify(tender)) }}>Сохранить</button>
                    {tender.status >= 0 &&
                        <>
                            {tender.status < 6 && <button onClick={() => nextStageHandler(tender.status + 1)}>{getNextStageButtonText(tender.status)}</button>}
                            {(tender.status > 0 && tender.status < 6 && (tender.status & 1) == 0) && <button onClick={() => nextStageHandler(tender.status - 1)}>{getPreviousStageButtonText(tender.status)}</button>}
                            {tender.status < 6 && <button onClick={() => nextStageHandler(-1)}>Не участвуем</button>}
                        </>
                    }
                </div>
            </div>
        </div>
    );
});
export default TenderPageClient;
