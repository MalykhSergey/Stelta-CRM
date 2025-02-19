import {DocumentRequest} from "@/models/Tender/DocumentRequest";
import FileName from "@/models/Tender/FileName";
import {observer} from "mobx-react-lite";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import styles from './DocumentRequestForm.module.css';

interface DocumentRequestFormProps {
    tenderId: number,
    documentRequest: DocumentRequest,
    orderNumber: number,
    isEditable: boolean,
    deleteDocumentRequest: () => void,
}

const DocumentRequestForm: React.FC<DocumentRequestFormProps> = observer(({
                                                                      tenderId,
                                                                      documentRequest,
                                                                      orderNumber,
                                                                      isEditable,
                                                                      deleteDocumentRequest
                                                                  }) => {
    return (
        <div className={styles.documentRequest}>
            <DocumentsForm tenderId={tenderId} stage={1}
                           pushFile={(fileName: FileName) => documentRequest.addFile(fileName)}
                           removeFile={(fileName: FileName) => documentRequest.removeFile(fileName)}
                           specialPlaceName='documentRequestId'
                           specialPlaceId={documentRequest.id}
                           fileNames={documentRequest.fileNames} title={`Дозапрос документов ${orderNumber}`}
                           isEditable={isEditable}
                           className='card'
                           independent={isEditable}
                           onDelete={deleteDocumentRequest}
            />
            <div>
                <label htmlFor={`documentRequest${documentRequest.id}`}>Дата предоставления ответа</label>
                <input id={`documentRequest${documentRequest.id}`} type="date" value={documentRequest.date}
                       onChange={(e) => documentRequest.setDate(e.currentTarget.value)} required disabled={!isEditable}/>
            </div>
        </div>
    )
})
export default DocumentRequestForm