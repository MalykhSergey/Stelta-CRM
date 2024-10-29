import FileName from '@/app/models/FileName';
import { RebiddingPrice } from '@/app/models/RebiddingPrice';
import { addRebiddingPrice } from '@/app/models/TenderService';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeAutoObservable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import styles from './RebiddingPriceForm.module.css';
interface RebiddingPriceFormProps {
    tender: Tender,
    isDone: boolean,
}
const RebiddingPriceForm: React.FC<RebiddingPriceFormProps> = observer(({ tender }) => {
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
            <div key={index} className={styles.rebiddingPrice}>
                <DocumentsForm tenderId={tender.id} stage={1}
                    pushFile={(fileName: FileName) => rebiddingPrice.addFile(fileName)}
                    removeFile={(fileName: FileName) => rebiddingPrice.removeFile(fileName)}
                    specialPlaceName='rebiddingPriceId'
                    specialPlaceId={rebiddingPrice.id}
                    fileNames={rebiddingPrice.fileNames} title={`Переторжка ${index + 1}`} isEditable={true} ></DocumentsForm >
                <div>
                    <label htmlFor={`rebiddingPrice${index}`}>Сумма</label>
                    <input id={`rebiddingPrice${index}`} type="text" value={rebiddingPrice.price + " ₽"}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*\d{2})/g, '')
                            // e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                            const cursorPosition = e.target.selectionStart;
                            requestAnimationFrame(() => {
                                e.target.selectionStart = cursorPosition;
                                e.target.selectionEnd = cursorPosition;
                            });
                            const result = rebiddingPrice.setPrice(e.target.value)
                            if (!result.ok)
                                errors[rebiddingPrice.id] = result.error
                            else
                                delete errors[rebiddingPrice.id]
                        }} required />
                    {errors[rebiddingPrice.id] && <span className={styles.error}>{errors[rebiddingPrice.id]}</span>}
                </div>
            </div>
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 2</h3>
                <button className={`iconButton toggler`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className='hiddenContent'>
                <DocumentsForm tenderId={tender.id} stage={2}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 2)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 2)}
                    fileNames={tender.stagedFileNames[2]} title='Документы 2 этапа' isEditable={true}></DocumentsForm>
                <DocumentsForm tenderId={tender.id} stage={3}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 3)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 3)}
                    fileNames={tender.stagedFileNames[3]} title='Формы 2 этапа' isEditable={true}></DocumentsForm>
                {rebiddingPrices}
                <button onClick={handleClick}>Переторжка</button>
            </div>
        </div>
    )
});
export default RebiddingPriceForm