import { DateRequest } from '@/app/models/DateRequest';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import styles from './StageForm_1.module.css';
import { addDateRequest } from '@/app/models/TenderService';
import FileName from '@/app/models/FileName';
interface StageForm_1Props {
    tender: Tender,
}
const StageForm_1: React.FC<StageForm_1Props> = observer(({ tender }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    // let input_file = useRef(null)
    const handleClick = async () => {
        tender.datesRequests.push(new DateRequest(0, '', []))
        console.log(`ID = ${await addDateRequest(tender.id)}`)
        // input_file.current.click()
    }
    // const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.currentTarget.files)
    //         for (let file of e.currentTarget.files) {
    //             tender.fileNames.push(file.name)
    //         }
    // }
    const datesRequests: any = []
    tender.datesRequests.forEach((dateRequest, index) => {
        datesRequests.push(<DocumentsForm key={index} tenderId={tender.id} stage={1}
            pushFile={(fileName: FileName) => dateRequest.addFile(fileName)}
            removeFile={(fileName: FileName) => dateRequest.removeFile(fileName)}
            specialPlaceName='dateRequestId'
            specialPlaceId={dateRequest.id}
            fileNames={dateRequest.fileNames} title={`Дозапрос ${index + 1} этапа`} isEditable={true} ></DocumentsForm >)
    })
    return (
        <div className={`card ${styles.form} ${collapsed.isTrue ? styles.expanded : ''}`}><h3>Этап 1 <button className={styles.toggler} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button></h3>
            <DocumentsForm tenderId={tender.id} stage={1}
                pushFile={(fileName: FileName) => tender.addToStagedComments(fileName, 1)}
                removeFile={(fileName: FileName) => tender.removeFileFromStagedComments(fileName, 1)}
                fileNames={tender.stagedFileNames[1]} title='Формы 1 этапа' isEditable={true}></DocumentsForm>
            {datesRequests}
            <button onClick={handleClick}>Дозапрос документов</button>
        </div>
    )
});
export default StageForm_1