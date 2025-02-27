import {showMessage} from "@/app/components/Alerts/Alert";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";
import DocumentsForm from '@/app/tender/DocumentForm/DocumentsForm';
import {DocumentRequest} from '@/models/Tender/DocumentRequest';
import {Tender} from '@/models/Tender/Tender';
import {addDocumentRequest, deleteDocumentRequestById} from '@/models/Tender/TenderService';
import {makeAutoObservable} from 'mobx';
import {observer} from 'mobx-react-lite';
import StageStyles from '../StageForms.module.css';
import DocumentRequestForm from './DocumentRequestForm';
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";

interface StageFormProps {
    tender: Tender,
    isEditable: boolean
}

const StageForm1: React.FC<StageFormProps> = observer(({tender, isEditable}) => {
    const handleClick = async () => {
        const result = await addDocumentRequest(tender.id);
        if (result?.error) {
            showMessage(result.error)
            return
        }
        showMessage("Дозапрос успешно создан.", 'successful')
        tender.documentRequests.push(makeAutoObservable(new DocumentRequest(result, new Date(Date.now()).toISOString().slice(0, 10), [])))
    }
    const datesRequests = tender.documentRequests.map((documentRequest, index) => {
        return <DocumentRequestForm
            documentRequest={documentRequest}
            deleteDocumentRequest={async () => {
                const result = await deleteDocumentRequestById(tender.id, documentRequest.id)
                if (result?.error) {
                    showMessage(result.error)
                    return
                }
                showMessage("Дозапрос успешно удалён.", 'successful');
                tender.deleteDocumentRequest(documentRequest)
            }}
            tenderId={tender.id} orderNumber={index + 1}
            isEditable={(index + 1 == tender.documentRequests.length) && isEditable}
            key={index}></DocumentRequestForm>
    })
    return (
        <ExpandableForm
            start_value={isEditable}
            header={(toggle, isExpanded) => {
                return (
                    <div className={StageStyles.cardHeader}>
                        <h3>Этап 1</h3>
                        <ExpandButton onClick={toggle} className={StageStyles.rightPanel}
                                      expanded={!isExpanded}/>
                    </div>
                )
            }}>
            <div className={StageStyles.stageForm}>
                <DocumentsForm
                    title='Формы 1 этапа'
                    tenderId={tender.id}
                    specialPlaceName={'stage'}
                    specialPlaceId={1}
                    fileNames={tender.stagedFileNames[1]}
                    isEditable={isEditable}/>
                {datesRequests}
                {isEditable && <button className='BlueButton' onClick={handleClick}>Дозапрос документов</button>}
            </div>
        </ExpandableForm>
    )
});
export default StageForm1