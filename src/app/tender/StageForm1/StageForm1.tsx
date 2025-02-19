import { showMessage } from "@/app/components/Alerts/Alert";
import { ExpandButton } from "@/app/components/Buttons/ExpandButton/ExpandButton";
import DocumentsForm from '@/app/tender/DocumentForm/DocumentsForm';
import { DocumentRequest } from '@/models/Tender/DocumentRequest';
import FileName from '@/models/Tender/FileName';
import { Tender } from '@/models/Tender/Tender';
import { addDocumentRequest, deleteDocumentRequestById } from '@/models/Tender/TenderService';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import StageStyles from '../StageForms.module.css';
import DocumentRequestForm from './DocumentRequestForm';

interface StageFormProps {
    tender: Tender,
    isEditable: boolean
}

const StageForm1: React.FC<StageFormProps> = observer(({ tender, isEditable }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: isEditable,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    const handleClick = async () => {
        const result = await addDocumentRequest(tender.id);
        if (result?.error){
            showMessage(result.error)
            return
        }
        showMessage("Дозапрос успешно создан.",'successful')
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
        <div className={`card ${StageStyles.dynamicSizeForm}  ${collapsed.isTrue ? StageStyles.expanded : ''}`}>
            <div className={StageStyles.cardHeader}>
                <h3>Этап 1</h3>
                <ExpandButton onClick={collapsed.toggle} className={StageStyles.rightPanel}
                    expanded={!collapsed.isTrue} />
            </div>
            <div className={`${StageStyles.hiddenContent}  ${StageStyles.stageForm}`}>
                <DocumentsForm
                    title='Формы 1 этапа'
                    tenderId={tender.id}
                    stage={1}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 1)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 1)}
                    fileNames={tender.stagedFileNames[1]}
                    isEditable={isEditable} className='card' />
                {datesRequests}
                {isEditable && <button className='BlueButton' onClick={handleClick}>Дозапрос документов</button>}
            </div>
        </div>
    )
});
export default StageForm1