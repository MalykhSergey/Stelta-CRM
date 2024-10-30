import { DateRequest } from '@/app/models/DateRequest';
import FileName from '@/app/models/FileName';
import { addDateRequest } from '@/app/models/TenderService';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import DateRequestForm from './DateRequest';
import styles from './RequestDate.module.css';
interface StageFormProps {
    tender: Tender,
    isDone: boolean,
}
const StageForm1: React.FC<StageFormProps> = observer(({ tender }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleClick = async () => {
        tender.datesRequests.push(makeAutoObservable(new DateRequest(await addDateRequest(tender.id), new Date(Date.now()).toISOString().slice(0, 10), [])))
    }
    const datesRequests: any = []
    tender.datesRequests.forEach((dateRequest, index) => {
        datesRequests.push(
            // <div key={index} className={styles.dateRequest}>
            //     <DocumentsForm tenderId={tender.id} stage={1}
            //         pushFile={(fileName: FileName) => dateRequest.addFile(fileName)}
            //         removeFile={(fileName: FileName) => dateRequest.removeFile(fileName)}
            //         specialPlaceName='dateRequestId'
            //         specialPlaceId={dateRequest.id}
            //         fileNames={dateRequest.fileNames} title={`Дозапрос документов ${index + 1}`} isEditable={true} ></DocumentsForm >
            //     <div>
            //         <label htmlFor={`dateRequest${index}`}>Дата предоставления ответа</label>
            //         <input id={`dateRequest${index}`} type="date" value={dateRequest.date} onChange={(e) => dateRequest.setDate(e.currentTarget.value)} required />
            //     </div>
            // </div>
            <DateRequestForm dateRequest={dateRequest} tenderId={tender.id} orderNumber={index+1} key={index}></DateRequestForm>
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 1</h3>
                <button className={`iconButton toggler`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className='hiddenContent'>
                <DocumentsForm tenderId={tender.id} stage={1}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 1)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 1)}
                    fileNames={tender.stagedFileNames[1]} title='Формы 1 этапа' isEditable={true}></DocumentsForm>
                {datesRequests}
                <button onClick={handleClick}>Дозапрос документов</button>
            </div>
        </div>
    )
});
export default StageForm1