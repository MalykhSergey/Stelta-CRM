'use client';

import {useAuth} from "@/app/AuthContext";
import {showMessage} from '@/app/components/Alerts/Alert';
import {PrimaryButton} from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import CommentsForm from '@/app/tender/CommentsForm/CommentsForm';
import StageForm1 from '@/app/tender/StageForm1/StageForm1';
import StageForm2 from '@/app/tender/StageForm2/StageForm2';
import StageForm3 from '@/app/tender/StageForm3/StageForm3';
import TenderForm from '@/app/tender/TenderForm/TenderForm';
import Company from '@/models/Company/Company';
import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {Tender} from '@/models/Tender/Tender';
import {deleteTender, updateTenderById} from '@/models/Tender/TenderService';
import {Role} from "@/models/User/User";
import {observer, useLocalObservable} from 'mobx-react-lite';
import {useRouter} from 'next/navigation';
import styles from "./TenderPageClient.module.css";
import {createContactPerson} from "@/models/Company/ContactPerson/ContactPersonService";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";

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

const TenderPageClient = observer((props: { tender: string, companies: string }) => {
    const companies = useLocalObservable(() => Company.fromJSONArray(props.companies))
    const tender = useLocalObservable(() => {
        const temp = Tender.fromJSON(props.tender)
        if (temp.company.id != 0)
            temp.company = companies.find(company => company.id === temp.company.id)!
        return temp
    })
    const router = useRouter()
    const auth = useAuth()
    const isAuth = auth.user.name != '' && auth.user.role != Role.Viewer
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
        // Обновить контактное лицо в организациях, т.к. могло быть добавлено новое
        if ((tender.status == 0 || tender.status == 1) && tender.contactPerson.id == 0) {
            if (tender.company.id == 0) {
                showMessage("Выберите организацию!", "error")
            }
            const result = await createContactPerson({...tender.contactPerson}, tender.company.id)
            if (result?.error) {
                showMessage(result.error)
                return
            }
            showMessage("Создано новое контактное лицо!", "successful")
            tender.contactPerson.id = result
            const new_contact_person = new ContactPerson(tender.contactPerson.id, tender.contactPerson.name, tender.contactPerson.phoneNumber, tender.contactPerson.email)
            tender.company.addContactPerson(new_contact_person)
        }
        const result = await updateTenderById(JSON.stringify(tender))
        if (result?.error)
            showMessage(result.error)
        else {
            showMessage("Данные успешно сохранены!", "successful")
        }
    }
    const updateStageHandler = async (stage: number) => {
        tender.status = stage
        saveHandler()
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
                <DocumentsForm title='Документы тендера' tenderId={tender.id} fileNames={tender.stagedFileNames[0]}
                               specialPlaceName={'stage'} specialPlaceId={0} isEditable={tender.status == 0}
                               isOpened={isEditable.company}/>
                {Math.abs(tender.status) >= 1 &&
                    <StageForm1 tender={tender} isEditable={tender.status == 1 && isAuth}/>}
                {Math.abs(tender.status) >= 3 &&
                    <StageForm2 tender={tender} isEditable={tender.status == 3 && isAuth}/>}
                {Math.abs(tender.status) >= 5 &&
                    <StageForm3 tender={tender} isEditable={tender.status == 5 && isAuth}/>}
                <CommentsForm tender={tender}/>
                {isAuth && <div className={styles.buttonRow}>
                    {(tender.status > 0 && tender.status < 6 && (tender.status & 1) == 0) &&
                        <button className='OrangeButton'
                                onClick={() => updateStageHandler(tender.status - 1)}>{getOrangeButtonText(tender.status)}</button>}
                    {tender.status >= 0 && tender.status < 6 && <button className='GreenButton'
                                                                        onClick={() => updateStageHandler(tender.status + 1)}>{getGreenButtonText(tender.status)}</button>}
                    <PrimaryButton onClick={saveHandler}>Сохранить</PrimaryButton>
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
