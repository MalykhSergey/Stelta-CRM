import FileName from "@/app/models/FileName";
import { Tender } from "@/app/models/Tender";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer, useLocalObservable } from "mobx-react-lite";
import DocumentsForm from "../DocumentForm/DocumentForm";
import styles from "./StageForm3.module.css";
interface StageForm3Props {
    tender: Tender
}
const StageForm3: React.FC<StageForm3Props> = observer(({ tender }) => {
    const isEditable = tender.status == 5;
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Договор</h3>
                <button className={`iconButton toggler rightPanel`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className='hiddenContent stageForm'>
                <DocumentsForm tenderId={tender.id} stage={5}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 5)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 5)}
                    fileNames={tender.stagedFileNames[5]} title='Документы договора' isEditable={isEditable} independent={false} className='card' />
                <div className={styles.inputGroup}>
                    <label htmlFor={`contractDate${tender.id}`}>Дата заключения договора:</label>
                    <input id={`contractDate${tender.id}`} value={tender.contractDate} onChange={(e) => tender.setContractDate(e.currentTarget.value)} type="date" disabled={!isEditable} />
                    <label htmlFor={`contractNumber${tender.id}`}>Номер заключения договора:</label>
                    <input id={`contractNumber${tender.id}`} value={tender.contractNumber} onChange={(e) => tender.setContractNumber(e.currentTarget.value)} type="text" disabled={!isEditable} />
                </div>
            </div>
        </div>
    )
})
export default StageForm3