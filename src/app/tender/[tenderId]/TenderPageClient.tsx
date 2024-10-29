'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import RebiddingPriceForm from '@/app/components/RebiddingPriceForm/RebiddingPriceForm';
import RequestDateForm from '@/app/components/RequestDateForm/RequestDateForm';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import FileName from '@/app/models/FileName';
import { Tender } from '@/app/models/Tender';
import { updateTenderById } from '@/app/models/TenderService';
import { observer } from 'mobx-react-lite';

const nextStageButtonText = new Map()
nextStageButtonText.set(0, 'Участвовать')
nextStageButtonText.set(1, 'Подать заявку')
nextStageButtonText.set(2, 'Сметный расчёт')
nextStageButtonText.set(3, 'Подать заявку')
nextStageButtonText.set(4, 'Победа')
nextStageButtonText.set(5, 'Договор подписан')
const previousStageButtonText = new Map()
previousStageButtonText.set(2, 'Дозапрос')
previousStageButtonText.set(4, 'Переторжка')

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
    const nextStageHandler = () => {
        tender.status += 1;
        updateTenderById(JSON.stringify(tender))
    }
    const previousStageHandler = () => {
        tender.status -= 1;
        updateTenderById(JSON.stringify(tender))
    }
    const failStageHandler = () => {
        tender.status = -1;
        updateTenderById(JSON.stringify(tender))
    }
    return (
        <div>
            <h1>Форма для тендера</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
                <div style={{}}>
                    <TenderForm tender={tender} isEditable={isEditable} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', width: '800px' }}>
                    <DocumentsForm tenderId={tender.id} stage={0} fileNames={tender.stagedFileNames[0]}
                        pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 0)}
                        removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 0)}
                        title='Документы тендера' isEditable={true} />
                    {tender.status == 1 && <RequestDateForm tender={tender} isDone={false} />}
                    {tender.status > 1 && <RequestDateForm tender={tender} isDone={true} />}
                    {tender.status == 3 && <RebiddingPriceForm tender={tender} isDone={false} />}
                    {tender.status > 3 && <RebiddingPriceForm tender={tender} isDone={true} />}
                    <CommentsForm tender={tender} />
                    <button onClick={() => { updateTenderById(JSON.stringify(tender)) }}>Сохранить</button>
                    {tender.status >= 0 &&
                        <>
                            <button onClick={nextStageHandler}>{nextStageButtonText.get(tender.status)}</button>
                            {(tender.status & 1) == 0 && <button onClick={previousStageHandler}>{previousStageButtonText.get(tender.status)}</button>}
                            <button onClick={failStageHandler}>Не участвуем</button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
});
export default TenderPageClient;
