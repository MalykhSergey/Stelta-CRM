import {DateRequest} from '@/models/Tender/DateRequest';
import FileName from '@/models/Tender/FileName';
import {addDateRequest} from '@/models/Tender/TenderService';
import {makeAutoObservable} from 'mobx';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Tender} from '@/models/Tender/Tender';
import DocumentsForm from '@/app/tender/DocumentForm/DocumentsForm';
import DateRequestForm from './DateRequest';
import StageStyles from '../StageForms.module.css'
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";

interface StageFormProps {
    tender: Tender,
    isEditable: boolean
}

const StageForm1: React.FC<StageFormProps> = observer(({tender, isEditable}) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: isEditable,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    const handleClick = async () => {
        tender.datesRequests.push(makeAutoObservable(new DateRequest(await addDateRequest(tender.id), new Date(Date.now()).toISOString().slice(0, 10), [])))
    }
    const datesRequests = tender.datesRequests.map((dateRequest, index) => {
        return <DateRequestForm
            dateRequest={dateRequest}
            deleteDateRequest={() => tender.deleteDateRequest(dateRequest)}
            tenderId={tender.id} orderNumber={index + 1}
            isEditable={(index + 1 == tender.datesRequests.length) && isEditable}
            key={index}></DateRequestForm>
    })
    return (
        <div className={`card ${StageStyles.dynamicSizeForm}  ${collapsed.isTrue ? StageStyles.expanded : ''}`}>
            <div className={StageStyles.cardHeader}>
                <h3>Этап 1</h3>
                <ExpandButton onClick={collapsed.toggle} className={StageStyles.rightPanel}
                              expanded={!collapsed.isTrue}/>
            </div>
            <div className={`${StageStyles.hiddenContent}  ${StageStyles.stageForm}`}>
                <DocumentsForm
                    title='Формы 1 этапа'
                    tenderId={tender.id}
                    stage={1}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 1)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 1)}
                    fileNames={tender.stagedFileNames[1]}
                    isEditable={isEditable} className='card'/>
                {datesRequests}
                {isEditable && <button className='BlueButton' onClick={handleClick}>Дозапрос документов</button>}
            </div>
        </div>
    )
});
export default StageForm1