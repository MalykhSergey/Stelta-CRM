import FileName from '@/app/models/FileName';
import { RebiddingPrice } from '@/app/models/RebiddingPrice';
import { addRebiddingPrice } from '@/app/models/TenderService';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import RebiddingPriceForm from './RebiddingPriceForm';
import styles from './StageForm2.module.css';
interface StageForm2Props {
    tender: Tender,
    isDone: boolean,
}
const StageForm2: React.FC<StageForm2Props> = observer(({ tender }) => {
    const errors: { [key: string]: string } = useLocalObservable(() => ({}))
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleClick = async () => {
        tender.rebiddingPrices.push(makeAutoObservable(new RebiddingPrice(await addRebiddingPrice(tender.id), '0', [])))
    }
    const rebiddingPrices: any = []
    tender.rebiddingPrices.forEach((rebiddingPrice, index) => {
        rebiddingPrices.push(
            <RebiddingPriceForm key={index} tenderId={tender.id} rebiddingPrice={rebiddingPrice} orderNumber={index + 1} />
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 2</h3>
                <button className={`iconButton toggler`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className={`hiddenContent ${styles.stageForm}`}>
                <DocumentsForm tenderId={tender.id} stage={2}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 2)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 2)}
                    fileNames={tender.stagedFileNames[2]} title='Документы 2 этапа' isEditable={true} independent={false} className='card'/>
                <DocumentsForm tenderId={tender.id} stage={3}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 3)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 3)}
                    fileNames={tender.stagedFileNames[3]} title='Формы 2 этапа' isEditable={true} independent={false} className='card'/>
                {rebiddingPrices}
                <button onClick={handleClick}>Переторжка</button>
            </div>
        </div>
    )
});
export default StageForm2