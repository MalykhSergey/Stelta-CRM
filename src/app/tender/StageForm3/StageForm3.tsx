import FileName from "@/models/FileName";
import {Tender} from "@/models/Tender/Tender";
import {observer, useLocalObservable} from "mobx-react-lite";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import styles from "./StageForm3.module.css";
import StageStyles from "@/app/tender/StageForms.module.css";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";

interface StageForm3Props {
    tender: Tender,
    isEditable: boolean
}

const StageForm3: React.FC<StageForm3Props> = observer(({tender, isEditable}) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    return (
        <div className={`card ${StageStyles.dynamicSizeForm}  ${collapsed.isTrue ? StageStyles.expanded : ''}`}>
            <div className={StageStyles.cardHeader}>
                <h3>Договор</h3>
                <ExpandButton onClick={collapsed.toggle} className={StageStyles.rightPanel} expanded={!collapsed.isTrue}/>
            </div>
            <div className={`${StageStyles.hiddenContent}  ${StageStyles.stageForm}`}>
                <DocumentsForm tenderId={tender.id} stage={5}
                               pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 5)}
                               removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 5)}
                               fileNames={tender.stagedFileNames[5]} title='Документы договора' isEditable={isEditable}
                               independent={false} className='card'/>
                <div id={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label htmlFor={`contractDate${tender.id}`}>Дата заключения договора:</label>
                        <input id={`contractDate${tender.id}`} value={tender.contractDate}
                               onChange={(e) => tender.setContractDate(e.currentTarget.value)} type="date"
                               disabled={!isEditable}/>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor={`contractNumber${tender.id}`}>Номер заключения договора:</label>
                        <input id={`contractNumber${tender.id}`} value={tender.contractNumber}
                               onChange={(e) => tender.setContractNumber(e.currentTarget.value)} type="text"
                               disabled={!isEditable}/>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default StageForm3