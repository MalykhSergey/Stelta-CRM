import { DateRequest } from "@/app/models/DateRequest";
import FileName from "@/app/models/FileName";
import { observer } from "mobx-react-lite";
import DocumentsForm from "../DocumentForm/DocumentForm";
import styles from './RequestDate.module.css';
interface DateRequestFormProps {
    tenderId: number,
    dateRequest: DateRequest,
    orderNumber: number,
}
const DateRequestForm: React.FC<DateRequestFormProps> = observer(({ tenderId, dateRequest, orderNumber }) => {
    return (
        <div className={styles.dateRequest}>
            <DocumentsForm tenderId={tenderId} stage={1}
                pushFile={(fileName: FileName) => dateRequest.addFile(fileName)}
                removeFile={(fileName: FileName) => dateRequest.removeFile(fileName)}
                specialPlaceName='dateRequestId'
                specialPlaceId={dateRequest.id}
                fileNames={dateRequest.fileNames} title={`Дозапрос документов ${orderNumber}`} isEditable={true} ></DocumentsForm >
            <div>
                <label htmlFor={`dateRequest${dateRequest.id}`}>Дата предоставления ответа</label>
                <input id={`dateRequest${dateRequest.id}`} type="date" value={dateRequest.date} onChange={(e) => dateRequest.setDate(e.currentTarget.value)} required />
            </div>
        </div>
    )
})
export default DateRequestForm