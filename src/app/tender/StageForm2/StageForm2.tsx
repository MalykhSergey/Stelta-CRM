import FileName from '@/models/Tender/FileName';
import {RebiddingPrice} from '@/models/Tender/RebiddingPrice';
import {addRebiddingPrice} from '@/models/Tender/TenderService';
import {makeAutoObservable} from 'mobx';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Tender} from '../../../models/Tender/Tender';
import DocumentsForm from '@/app/tender/DocumentForm/DocumentsForm';
import RebiddingPriceForm from './RebiddingPriceForm';
import styles from "./StageForm2.module.css"

import type {JSX} from "react";
import CurrencyInput from "react-currency-input-field";
import StageStyles from "@/app/tender/StageForms.module.css";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";

interface StageForm2Props {
    tender: Tender,
    isEditable: boolean
}

const StageForm2: React.FC<StageForm2Props> = observer(({tender, isEditable}) => {
    const error = useLocalObservable(() => ({
        value: '',
        setError(value: string) {
            this.value = value
        }
    }));
    const collapsed = useLocalObservable(() => ({
        isTrue: isEditable,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    const handleClick = async () => {
        tender.rebiddingPrices.push(makeAutoObservable(new RebiddingPrice(await addRebiddingPrice(tender.id), '0', [])))
    }
    const rebiddingPrices: JSX.Element[] = []
    tender.rebiddingPrices.forEach((rebiddingPrice, index) => {
        rebiddingPrices.push(
            <RebiddingPriceForm key={index} tenderId={tender.id} deleteRebiddingPrice={() => {
                tender.deleteRebiddingPrice(rebiddingPrice)
            }} rebiddingPrice={rebiddingPrice} orderNumber={index + 1}
                                isEditable={(index + 1 == tender.rebiddingPrices.length) && isEditable}/>
        )
    })
    return (
        <div className={`card ${StageStyles.dynamicSizeForm}  ${collapsed.isTrue ? StageStyles.expanded : ''}`}>
            <div className={StageStyles.cardHeader}>
                <h3>Этап 2</h3>
                <ExpandButton onClick={collapsed.toggle} className={StageStyles.rightPanel}
                              expanded={!collapsed.isTrue}/>
            </div>
            <div className={`${StageStyles.hiddenContent}  ${StageStyles.stageForm}`}>
                <DocumentsForm tenderId={tender.id} stage={2}
                               pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 2)}
                               removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 2)}
                               fileNames={tender.stagedFileNames[2]} title='Документы 2 этапа' isEditable={isEditable}
                               independent={false} className='card'/>
                <div className={styles.secondForms}>
                    <DocumentsForm tenderId={tender.id} stage={3}
                                   pushFile={(fileName: FileName) => tender.addToStagedFileNames(fileName, 3)}
                                   removeFile={(fileName: FileName) => tender.removeFileFromStagedFileNames(fileName, 3)}
                                   fileNames={tender.stagedFileNames[3]} title='Формы 2 этапа' isEditable={isEditable}
                                   independent={false} className='card'/>
                    <div>
                        <label htmlFor={`Stage2FormPrice${tender.id}`}>Наша цена:</label>
                        <CurrencyInput
                            name="Price"
                            id={`Stage2FormPrice${tender.id}`}
                            value={tender.rebiddingPrices.length == 0 ? tender.price : tender.rebiddingPrices.at(-1)?.price}
                            className={styles.input}
                            disabled={!isEditable || tender.rebiddingPrices.length != 0}
                            allowNegativeValue={false}
                            onValueChange={value => {
                                const result = tender.setPrice(value ? value : '')
                                if (!result.ok)
                                    error.setError(result.error)
                                else
                                    error.setError('')
                            }}
                            suffix="₽"
                        />
                    </div>
                </div>
                {rebiddingPrices}
                {isEditable && <button className='BlueButton' onClick={handleClick}>Переторжка</button>}
            </div>
        </div>
    );
});
export default StageForm2