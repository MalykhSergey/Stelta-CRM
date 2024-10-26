"use client"
import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import StageForm_1 from '@/app/components/StageForm_1/StageForm_1';
import { Tender } from '@/app/models/Tender';
import { getTenderById } from '@/app/models/TenderService';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import TenderForm from '../../components/TenderForm/TenderForm';

const TenderPage = observer(({ params }: { params: { tenderId: number } }) => {
    let isEditable = useLocalObservable(() => ({
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
    }))
    let tender = useLocalObservable(() => ({
        tender: Tender.getEmpty(),
        update(tender: Tender) {
            this.tender = tender
        }
    }))
    const handleToggle = (field: keyof typeof isEditable) => {
        isEditable[field] = !isEditable[field];
    };
    useEffect(() => {
        const loadTender = async () => {
            let loaded_tender = Tender.fromPlainObject(JSON.parse(await getTenderById(params.tenderId)))
            makeAutoObservable(loaded_tender)
            tender.update(loaded_tender)
        }
        loadTender()
    }, []);
    return (
        <div>
            <h1>Форма для тендера</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
                <div style={{ flexGrow: '1' }}>
                    <TenderForm tender={tender.tender} isEditable={isEditable} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '2', gap: '50px' }}>
                    <DocumentsForm tender={tender.tender} title='Документы тендера' isEditable={true}></DocumentsForm>
                    <StageForm_1 tender={tender.tender} title='' isEditable={true}></StageForm_1>
                    <CommentsForm tender={tender.tender}></CommentsForm>
                </div>
                {/* <TenderFormCopy tender={tenderStorage.getAll()[0]}/> */}
                {/* <form style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.keys(isEditable).map((key) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <label>
                {key}
                <input
                  type="checkbox"
                  checked={isEditable[key as keyof typeof isEditable]}
                  onChange={() => handleToggle(key as keyof typeof isEditable)}
                />
              </label>
            </div>
          ))}
        </form> */}
            </div>
        </div>
    );
});

export default TenderPage;
