"use client"
import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useContext } from 'react';
import TenderForm from '../../components/TenderForm/TenderForm';
import { TenderStorageContext } from '../../layout';

const TenderPage = observer(({ params }: { params: { tenderId: string } }) => {
  let tenderStorage = useContext(TenderStorageContext)
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
  const handleToggle = (field: keyof typeof isEditable) => {
    isEditable[field] = !isEditable[field];
  };
  const tender = tenderStorage.getById(Number.parseInt(params.tenderId));
  return (
    <div>
      <h1>Форма для тендера</h1>
      <div>
        <TenderForm tender={tender} isEditable={isEditable} />
        <CommentsForm tender={tender}></CommentsForm>
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
