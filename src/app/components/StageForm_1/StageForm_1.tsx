import { DateRequest } from '@/app/models/DateRequest';
import FileName from '@/app/models/FileName';
import { addDateRequest } from '@/app/models/TenderService';
import { faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import styles from './StageForm_1.module.css';
interface StageForm_1Props {
    tender: Tender,
}
const StageForm_1: React.FC<StageForm_1Props> = observer(({ tender }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleClick = async () => {
        tender.datesRequests.push(makeAutoObservable(new DateRequest(await addDateRequest(tender.id), '', [])))
    }
    const datesRequests: any = []
    tender.datesRequests.forEach((dateRequest, index) => {
        console.log(dateRequest)
        datesRequests.push(
            <div key={index} className={styles.dateRequest}>
                <DocumentsForm tenderId={tender.id} stage={1}
                    pushFile={(fileName: FileName) => dateRequest.addFile(fileName)}
                    removeFile={(fileName: FileName) => dateRequest.removeFile(fileName)}
                    specialPlaceName='dateRequestId'
                    specialPlaceId={dateRequest.id}
                    fileNames={dateRequest.fileNames} title={`Дозапрос ${index + 1} этапа`} isEditable={true} ></DocumentsForm >
                <div>
                    <label htmlFor={`dateRequest${index}`}>Дата предоставления ответа</label>
                    <input id={`dateRequest${index}`} type="date" />
                </div>
            </div>
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 1</h3>
                <button className={`iconButton ${styles.toggler}`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button>
                <button className={`iconButton closeButton`}><FontAwesomeIcon icon={faXmark} className={``} /></button>
            </div>
            <div className='hiddenContent'>
                <DocumentsForm tenderId={tender.id} stage={1}
                    pushFile={(fileName: FileName) => tender.addToStagedComments(fileName, 1)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedComments(fileName, 1)}
                    fileNames={tender.stagedFileNames[1]} title='Формы 1 этапа' isEditable={true}></DocumentsForm>
                {datesRequests}
                <button onClick={handleClick}>Дозапрос документов</button>
            </div>
        </div>
    )
});
export default StageForm_1