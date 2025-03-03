import {RebiddingPrice} from "@/models/Tender/RebiddingPrice";
import {observer} from "mobx-react-lite";
import {useState} from "react";
import DocumentsForm from "@/app/tender/DocumentForm/DocumentsForm";
import styles from './RebiddingPriceForm.module.css';
import CurrencyInput from "react-currency-input-field";

interface RebiddingPriceProps {
    tenderId: number,
    rebiddingPrice: RebiddingPrice,
    orderNumber: number,
    isEditable: boolean,
    deleteRebiddingPrice: () => void
}

const RebiddingPriceForm: React.FC<RebiddingPriceProps> = observer(({
                                                                        tenderId,
                                                                        rebiddingPrice,
                                                                        orderNumber,
                                                                        isEditable,
                                                                        deleteRebiddingPrice
                                                                    }) => {
    const [error, setError] = useState('')
    return (
        <div className={styles.rebiddingPrice}>
            <DocumentsForm tenderId={tenderId}
                           specialPlaceName='rebiddingPriceId'
                           specialPlaceId={rebiddingPrice.id}
                           fileNames={rebiddingPrice.fileNames} title={`Переторжка ${orderNumber}`}
                           onDelete={deleteRebiddingPrice}
                           isEditable={isEditable} isShowDelete={isEditable}/>
            <div>
                <label htmlFor={`rebiddingPrice${rebiddingPrice.id}`}>Наша цена:</label>
                <CurrencyInput
                    name="Price"
                    id={`RebPrice${rebiddingPrice.id}`}
                    value={rebiddingPrice.price}
                    className={styles.input}
                    disabled={!isEditable}
                    allowNegativeValue={false}
                    onValueChange={value => {
                        const result = rebiddingPrice.setPrice(value!)
                        if (!result.ok)
                            setError(result.error)
                        else
                            setError('')
                    }}
                    suffix="₽"
                />
                {error != '' && <span className='under-input-error'>{error}</span>}
            </div>
        </div>
    )
})
export default RebiddingPriceForm