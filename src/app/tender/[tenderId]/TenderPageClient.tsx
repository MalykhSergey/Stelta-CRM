'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import StageForm_1 from '@/app/components/StageForm_1/StageForm_1';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import FileName from '@/app/models/FileName';
import { Tender } from '@/app/models/Tender';
import { updateTenderById } from '@/app/models/TenderService';
import { observer, useLocalObservable } from 'mobx-react-lite';

const TenderPageClient = observer(({ tender }: { tender: Tender }) => {
    const isEditable = useLocalObservable(() => ({
        company: false,
        name: false,
        regNumber: true,
        lotNumber: true,
        initialMaxPrice: true,
        price: true,
        dates: true,
        contactPerson: true,
        phoneNumber: true,
        email: true,
    }));
    return (
        <div>
            <h1>Форма для тендера</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
                <div style={{}}>
                    <TenderForm tender={tender} isEditable={isEditable} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', width: '800px' }}>
                    <DocumentsForm tenderId={tender.id} stage={0} fileNames={tender.stagedFileNames[0]}
                        pushFile={(fileName: FileName) => tender.addToStagedComments(fileName, 0)}
                        removeFile={(fileName: FileName) => tender.removeFileFromStagedComments(fileName, 0)}
                        title='Документы тендера' isEditable={true} />
                    {tender.status == 1 && <StageForm_1 tender={tender} isDone={false} />}
                    {tender.status > 1 && <StageForm_1 tender={tender} isDone={true} />}
                    <CommentsForm tender={tender} />
                    <button onClick={() => {
                        updateTenderById(JSON.stringify(tender))
                    }}>UPDATE!!!</button>
                </div>
            </div>
        </div>
    );
});

export default TenderPageClient;
