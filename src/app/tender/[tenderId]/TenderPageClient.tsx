'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import StageForm_1 from '@/app/components/StageForm_1/StageForm_1';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import { Tender } from '@/app/models/Tender';
import { updateTenderById } from '@/app/models/TenderService';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';

const TenderPageClient = observer(({ tenderString }: { tenderString: string }) => {
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
    const tender = Tender.fromJSON(tenderString)
    makeAutoObservable(tender)

    // const handleToggle = (field: keyof typeof isEditable) => {
    //     isEditable[field] = !isEditable[field];
    // };

    return (
        <div>
            <h1>Форма для тендера</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
                <div style={{ flexGrow: '1' }}>
                    <TenderForm tender={tender} isEditable={isEditable} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '2', gap: '50px' }}>
                    <DocumentsForm tender={tender} title='Документы тендера' isEditable={true} />
                    <StageForm_1 tender={tender}/>
                    <CommentsForm tender={tender} />
                    <button onClick={()=>{updateTenderById(JSON.stringify(tender))}}>UPDATE!!!</button>
                </div>
            </div>
        </div>
    );
});

export default TenderPageClient;
