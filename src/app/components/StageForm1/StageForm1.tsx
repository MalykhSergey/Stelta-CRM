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
interface StageFormProps {
    tender: Tender
}
const StageForm1: React.FC<StageFormProps> = observer(({ tender }) => {
    const isEditable = tender.status == 1;
    const isCompleted = tender.status <= 2;
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
            <DateRequestForm dateRequest={dateRequest} deleteDateRequest={() => { tender.deleteDateRequest(dateRequest) }} tenderId={tender.id} orderNumber={index + 1} isEditable={(index + 1 == tender.datesRequests.length) && isEditable} key={index}></DateRequestForm>
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 1</h3>
                <button className={`iconButton toggler`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={` ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className='hiddenContent stageForm'>
                <DocumentsForm
                    title='Формы 1 этапа'
                    tenderId={tender.id}
                    stage={1}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 1)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 1)}
                    fileNames={tender.stagedFileNames[1]}
                    isEditable={isEditable} className='card' />
                {datesRequests}
                {isCompleted && <button onClick={handleClick}>Дозапрос документов</button>}
            </div>
        </div>
    )
});
export default StageForm1