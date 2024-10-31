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
interface StageForm2Props {
    tender: Tender
}
const StageForm2: React.FC<StageForm2Props> = observer(({ tender }) => {
    const error = useLocalObservable(() => ({
        value: '',
        setError(value: string) { this.value = value }
    }));
    const isEditable = tender.status == 3;
    const isCompleted = tender.status <= 4;
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleClick = async () => {
        tender.rebiddingPrices.push(makeAutoObservable(new RebiddingPrice(await addRebiddingPrice(tender.id), '0', [])))
    }
    const rebiddingPrices: JSX.Element[] = []
    tender.rebiddingPrices.forEach((rebiddingPrice, index) => {
        rebiddingPrices.push(
            <RebiddingPriceForm key={index} tenderId={tender.id} deleteRebiddingPrice={() => { tender.deleteRebiddingPrice(rebiddingPrice) }} rebiddingPrice={rebiddingPrice} orderNumber={index + 1} isEditable={(index + 1 == tender.rebiddingPrices.length) && isEditable} />
        )
    })
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Этап 2</h3>
                <button className={`iconButton toggler rightPanel`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={` ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
            </div>
            <div className='hiddenContent stageForm'>
                <DocumentsForm tenderId={tender.id} stage={2}
                    pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 2)}
                    removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 2)}
                    fileNames={tender.stagedFileNames[2]} title='Документы 2 этапа' isEditable={isEditable} independent={false} className='card' />
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <DocumentsForm tenderId={tender.id} stage={3}
                        pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 3)}
                        removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 3)}
                        fileNames={tender.stagedFileNames[3]} title='Формы 2 этапа' isEditable={isEditable} independent={false} className='card' />
                    <div>
                        <label htmlFor={`Stage2FormPrice${tender.id}`}>Наша цена:</label>
                        <input id={`Stage2FormPrice${tender.id}`} type="text" value={tender.price + " ₽"} onChange={
                            (e) => {
                                e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                                const cursorPosition = e.target.selectionStart;
                                requestAnimationFrame(() => {
                                    e.target.selectionStart = cursorPosition;
                                    e.target.selectionEnd = cursorPosition;
                                });
                                const result = tender.setPrice(e.target.value)
                                if (!result.ok)
                                    error.setError(result.error)
                                else
                                    error.setError('')
                            }
                        }
                            disabled={!isEditable || tender.rebiddingPrices.length > 0}
                        />
                    </div>
                </div>
                {rebiddingPrices}
                {isCompleted && <button onClick={handleClick}>Переторжка</button>}
            </div>
        </div>
    )
});
export default StageForm2