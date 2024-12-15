import {DateRequest} from "@/models/Tender/DateRequest";
import FileName from "@/models/Tender/FileName";
import {deleteDateRequestById} from "@/models/Tender/TenderService";
import {observer} from "mobx-react-lite";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import styles from './RequestDate.module.css';

interface DateRequestFormProps {
    tenderId: number,
    dateRequest: DateRequest,
    orderNumber: number,
    isEditable: boolean,
    deleteDateRequest: () => void,
}

const DateRequestForm: React.FC<DateRequestFormProps> = observer(({
                                                                      tenderId,
                                                                      dateRequest,
                                                                      orderNumber,
                                                                      isEditable,
                                                                      deleteDateRequest
                                                                  }) => {
    return (
        <div className={styles.dateRequest}>
            <DocumentsForm tenderId={tenderId} stage={1}
                           pushFile={(fileName: FileName) => dateRequest.addFile(fileName)}
                           removeFile={(fileName: FileName) => dateRequest.removeFile(fileName)}
                           specialPlaceName='dateRequestId'
                           specialPlaceId={dateRequest.id}
                           fileNames={dateRequest.fileNames} title={`Дозапрос документов ${orderNumber}`}
                           isEditable={isEditable}
                           className='card'
                           independent={isEditable}
                           onDelete={() => {
                               deleteDateRequest()
                               deleteDateRequestById(tenderId, dateRequest.id)
                           }}
            />
            <div>
                <label htmlFor={`dateRequest${dateRequest.id}`}>Дата предоставления ответа</label>
                <input id={`dateRequest${dateRequest.id}`} type="date" value={dateRequest.date}
                       onChange={(e) => dateRequest.setDate(e.currentTarget.value)} required disabled={!isEditable}/>
            </div>
        </div>
    )
})
export default DateRequestForm