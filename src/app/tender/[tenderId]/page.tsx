"use client"
import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentForm';
import { Tender } from '@/app/models/Tender';
import { getTenderById } from '@/app/models/TenderService';
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
            let loaded_tender = JSON.parse(await getTenderById(params.tenderId))
            tender.update(Tender.fromPlainObject(loaded_tender))
        }
        loadTender()
    }, []);
    return (
        <div>
            <h1>Форма для тендера</h1>
            <div style={{display:'flex',flexDirection:'row'}}>
                <TenderForm tender={tender.tender} isEditable={isEditable} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <CommentsForm tender={tender.tender}></CommentsForm>
                    <DocumentsForm tender={tender.tender}></DocumentsForm>
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
