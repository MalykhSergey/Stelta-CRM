import FileName from "@/app/models/FileName";
import { RebiddingPrice } from "@/app/models/RebiddingPrice";
import { deleteRebiddingPriceById } from "@/app/models/TenderService";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import DocumentsForm from "../DocumentForm/DocumentForm";
import styles from './RebiddingPriceForm.module.css';
interface RebiddingPriceProps {
    tenderId: number,
    rebiddingPrice: RebiddingPrice,
    orderNumber: number,
    isEditable: boolean,
    deleteRebiddingPrice: () => void
}
const RebiddingPriceForm: React.FC<RebiddingPriceProps> = observer(({ tenderId, rebiddingPrice, orderNumber, isEditable, deleteRebiddingPrice }) => {
    const [error, setError] = useState('')
    return (
        <div className={styles.rebiddingPrice}>
            <DocumentsForm tenderId={tenderId} stage={1}
                pushFile={(fileName: FileName) => rebiddingPrice.addFile(fileName)}
                removeFile={(fileName: FileName) => rebiddingPrice.removeFile(fileName)}
                specialPlaceName='rebiddingPriceId'
                specialPlaceId={rebiddingPrice.id}
                fileNames={rebiddingPrice.fileNames} title={`Переторжка ${orderNumber}`}
                onDelete={() => {
                    deleteRebiddingPrice()
                    deleteRebiddingPriceById(tenderId, rebiddingPrice.id)
                }}
                isEditable={isEditable} independent={isEditable} className="card" />
            <div>
                <label htmlFor={`rebiddingPrice${rebiddingPrice.id}`}>Наша цена:</label>
                <input id={`rebiddingPrice${rebiddingPrice.id}`} type="text" value={rebiddingPrice.price + " ₽"}
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                        const cursorPosition = e.target.selectionStart;
                        requestAnimationFrame(() => {
                            e.target.selectionStart = cursorPosition;
                            e.target.selectionEnd = cursorPosition;
                        });
                        const result = rebiddingPrice.setPrice(e.target.value)
                        if (!result.ok)
                            setError(result.error)
                        else
                            setError('')
                    }} required />
                {error != '' && <span className={styles.error}>{error}</span>}
            </div>
        </div>
    )
})
export default RebiddingPriceForm