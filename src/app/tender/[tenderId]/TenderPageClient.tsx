'use client';

import CommentsForm from '@/app/components/CommentsForm/CommentsForm';
import DocumentsForm from '@/app/components/DocumentForm/DocumentsForm';
import {showMessage} from '@/app/components/Alerts/Alert';
import TenderForm from '@/app/components/TenderForm/TenderForm';
import FileName from '@/models/FileName';
import {Tender} from '@/models/Tender/Tender';
import {deleteTender, updateTenderById} from '@/models/Tender/TenderService';
import StageForm1 from '@/app/tender/StageForm1/StageForm1';
import StageForm2 from '@/app/tender/StageForm2/StageForm2';
import StageForm3 from '@/app/tender/StageForm3/StageForm3';
import {observer} from 'mobx-react-lite';
import {useRouter} from 'next/navigation';
import styles from "./TenderPageClient.module.css";
import Company from '@/models/Company';
import {useAuth} from "@/app/AuthContext";

const getGreenButtonText = (status: number) => {
    switch (status) {
        case 0:
            return 'Участвовать';
        case 1:
            return 'Подать заявку';
        case 2:
            return 'Сметный расчёт';
        case 3:
            return 'Подать заявку';
        case 4:
            return 'Победа';
        case 5:
            return 'Договор подписан';
        default:
            return '';
    }
};
const getOrangeButtonText = (status: number) => {
    switch (status) {
        case 2:
            return 'Дозапрос';
        case 4:
            return 'Переторжка';
        default:
            return '';
    }
};
const getLooseButtonText = (status: number) => {
    switch (status) {
        case 4:
            return 'Проиграли';
        default:
            return 'Не участвуем';
    }
};

const TenderPageClient = observer(({tender, companies}: { tender: Tender, companies: Company[] }) => {
    const router = useRouter()
    const auth = useAuth()
    const isAuth = !!auth.userName
    let isEditable = {
        status: isAuth,
        isSpecial: false,
        company: false,
        name: false,
        regNumber: false,
        lotNumber: false,
        initialMaxPrice: false,
        price: false,
        date1_start: false,
        date1_finish: false,
        date2_finish: false,
        date_finish: false,
        contactPerson: false,
        phoneNumber: false,
        email: false,
    };
    if (isAuth) {
        if (tender.status == 0)
            isEditable = {
                status: isAuth,
                isSpecial: true,
                company: true,
                name: true,
                regNumber: true,
                lotNumber: true,
                initialMaxPrice: true,
                price: true,
                date1_start: true,
                date1_finish: true,
                date2_finish: true,
                date_finish: true,
                contactPerson: true,
                phoneNumber: true,
                email: true,
            };
        if (tender.status <= 2)
            isEditable.date1_finish = true
        if (tender.status <= 3)
            isEditable.date2_finish = true
        if (tender.status <= 4)
            isEditable.date_finish = true
    }
    const saveHandler = async () => {
        const result = await updateTenderById(JSON.stringify(tender))
        if (result?.error)
            showMessage(result.error)
        else {
            showMessage("Данные успешно сохранены!", "successful")
        }
    }
    const updateStageHandler = async (stage: number) => {
        tender.status = stage;
        saveHandler();
    }
    const deleteHandler = async () => {
        const result = await deleteTender(tender.id)
        if (result?.error)
            showMessage(result.error)
        else
            router.push('/')
    }

    return (
        <div id={styles.content}>
            <div id={styles.leftPanel}>
                <TenderForm tender={tender} companies={companies} isEditable={isEditable}/>
            </div>
            <div id={styles.rightPanel}>
                <DocumentsForm tenderId={tender.id} stage={0} fileNames={tender.stagedFileNames[0]}
                               pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 0)}
                               removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 0)}
                               title='Документы тендера' isEditable={tender.status == 0} className='card' isOpened={isEditable.company}/>
                {tender.status >= 1 && <StageForm1 tender={tender}/>}
                {tender.status >= 3 && <StageForm2 tender={tender}/>}
                {tender.status >= 5 && <StageForm3 tender={tender}/>}
                <CommentsForm tender={tender}/>
                {isAuth && <div className={styles.buttonRow}>
                    {(tender.status > 0 && tender.status < 6 && (tender.status & 1) == 0) &&
                        <button className='OrangeButton'
                                onClick={() => updateStageHandler(tender.status - 1)}>{getOrangeButtonText(tender.status)}</button>}
                    {tender.status >= 0 && tender.status < 6 && <button className='GreenButton'
                                                                        onClick={() => updateStageHandler(tender.status + 1)}>{getGreenButtonText(tender.status)}</button>}
                    <button className='BlueButton' onClick={saveHandler}>Сохранить</button>
                    {tender.status == 0 &&
                        <button className='RedButton' onClick={() => deleteHandler()}>Удалить</button>}
                    {tender.status > 0 && tender.status < 5 && <button className='RedButton'
                                                                       onClick={() => updateStageHandler(-tender.status)}>{getLooseButtonText(tender.status)}</button>}
                </div>}
            </div>
        </div>
    );
});
export default TenderPageClient;
