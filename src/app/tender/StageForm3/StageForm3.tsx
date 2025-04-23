import {Tender} from "@/models/Tender/Tender";
import {observer} from "mobx-react-lite";
import StageStyles from "@/app/tender/StageForms.module.css";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import styles from "./StageForm3.module.css";

interface StageForm3Props {
    tender: Tender,
    isEditable: boolean
}

const StageForm3: React.FC<StageForm3Props> = observer(({tender, isEditable}) => {
    return (
        <ExpandableForm start_value={isEditable} header={(toggle, isExpanded) => (
            <div className={`${StageStyles.cardHeader}`}>
                <h3>Договор</h3>
                <ExpandButton onClick={toggle} className={StageStyles.rightPanel} expanded={!isExpanded}/>
            </div>
        )}>
            <div className={StageStyles.stageForm}>
                <DocumentsForm tenderId={tender.id} specialPlaceName={'stage'} specialPlaceId={5}
                               fileNames={tender.stagedFileNames[5]} title='Документы договора'
                               isEditable={isEditable}/>
                <div id={styles.grid}>
                    <label htmlFor={`contractDate${tender.id}`}>Дата заключения договора:</label>
                    <input id={`contractDate${tender.id}`} value={tender.contractDate}
                           onChange={(e) => tender.setContractDate(e.currentTarget.value)} type="date"
                           disabled={!isEditable}/>
                    <label htmlFor={`contractNumber${tender.id}`}>Номер заключённого договора:</label>
                    <input id={`contractNumber${tender.id}`} value={tender.contractNumber}
                           onChange={(e) => tender.setContractNumber(e.currentTarget.value)} type="text"
                           disabled={!isEditable}/>
                    <label htmlFor='isFrameContract'>Рамочный договор:</label>
                    <input type="checkbox" name="isFrameContract" id="isFrameContract"
                           checked={tender.isFrameContract}
                           onChange={()=>tender.toggleIsFrameContract()}
                           disabled={!isEditable}/>
                </div>
            </div>
        </ExpandableForm>
    )
})
export default StageForm3