import Company from '@/models/Company/Company'
import {default as getStatusName} from '@/models/Tender/Status'
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {Tender} from '@/models/Tender/Tender'
import styles from './TenderForm.module.css'
import CurrencyInput from "react-currency-input-field";
import {TenderFormField} from "@/app/tender/TenderForm/TenderFormField";
import {ContactPersonForm} from "@/app/tender/TenderForm/ContactPersonForm/ContactPersonForm";

interface TenderFormProps {
    tender: Tender,
    companies: Company[],
    isEditable: {
        status: boolean,
        isSpecial: boolean,
        company: boolean,
        name: boolean,
        regNumber: boolean,
        lotNumber: boolean,
        initialMaxPrice: boolean,
        price: boolean,
        date1_start: boolean,
        date1_finish: boolean,
        date2_finish: boolean,
        date_finish: boolean,
        contactPerson: boolean,
        phoneNumber: boolean,
        email: boolean
    }
}

const TenderForm = observer((props: TenderFormProps) => {
    const errors: { [key: string]: string } = useLocalObservable(() => ({}))
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (props.tender as any)["set" + name](value)
        if (!result.ok) {
            errors[name] = result.error
        } else {
            delete errors[name]
        }
    }
    return (
        <div className={`${styles.form} card`}>
            <label className={styles.label} htmlFor='Status'>Статус:</label>
            <div className={styles.formGroup}>
                <select id='Status' name="Status" value={props.tender.status} className={styles.input}
                        onChange={handleChange}
                        disabled={!props.isEditable.status}>
                    {props.tender.status < 0 &&
                        <>
                            <option value="-4">{getStatusName(-4)}</option>
                            <option value="-1">{getStatusName(-1)}</option>
                        </>
                    }
                    <option value="0">{getStatusName(0)}</option>
                    <option value="1">{getStatusName(1)}</option>
                    <option value="2">{getStatusName(2)}</option>
                    <option value="3">{getStatusName(3)}</option>
                    <option value="4">{getStatusName(4)}</option>
                    <option value="5">{getStatusName(5)}</option>
                    <option value="6">{getStatusName(6)}</option>
                </select>
            </div>
            <label className={styles.label} htmlFor="IsSpecial">Подыгрыш:</label>
            <div className={styles.formGroup}>
                <input type="checkbox" name="IsSpecial" id="IsSpecial" checked={props.tender.isSpecial}
                       onChange={() => props.tender.toggleIsSpecial()} disabled={!props.isEditable.isSpecial}/>
            </div>
            <label className={styles.label} htmlFor="Company">Организация:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <select name="Company" id="Company"
                            onChange={(e) => {
                                const selected_company = props.companies.find(company => company.id == Number.parseInt(e.currentTarget.value));
                                if (selected_company)
                                    props.tender.setCompany(selected_company);
                            }}
                            value={props.tender.company.id}
                            disabled={!props.isEditable.company}>
                        <option key={"option0"} value={0} disabled={true}>Выберите организацию</option>
                        {props.companies.map(company =>
                            <option key={"option" + company.id} value={company.id}>{company.name}</option>
                        )}
                    </select>
                </div>
                {errors['Company'] && <span></span>} {errors['Company'] &&
                <span className={styles.error}>{errors['Company']}</span>}
            </div>
            <TenderFormField propertyName="Name" value={props.tender.name} label="Полное наименование:"
                             onChange={handleChange} isEditable={props.isEditable.name} errors={errors}
                             type="textarea"/>
            <TenderFormField propertyName={'RegNumber'} value={props.tender.regNumber} label={"Реестровый номер  :"}
                             onChange={handleChange} isEditable={props.isEditable.regNumber} errors={errors}/>
            <TenderFormField propertyName={'LotNumber'} value={props.tender.lotNumber} label={"Лот номер:"}
                             onChange={handleChange} isEditable={props.isEditable.lotNumber} errors={errors}/>
            <label className={styles.label} htmlFor="InitialMaxPrice">НМЦК:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <CurrencyInput
                        name="InitialMaxPrice"
                        id="InitialMaxPrice"
                        value={props.tender.initialMaxPrice}
                        className={styles.input}
                        disabled={!props.isEditable.initialMaxPrice}
                        allowNegativeValue={false}
                        onValueChange={value => {
                            const result = props.tender.setInitialMaxPrice(value ? value : '')
                            if (!result.ok) {
                                errors['InitialMaxPrice'] = result.error
                            } else {
                                delete errors['InitialMaxPrice']
                            }
                        }}
                        suffix="₽"
                    />
                    {props.isEditable.initialMaxPrice &&
                        <FontAwesomeIcon icon={faPenToSquare} className={styles.icon}/>}
                </div>
            </div>
            {errors["InitialMaxPrice"] && <><span></span><span
                className='under-input-error'>{errors["InitialMaxPrice"]}</span></>}
            <label className={styles.label} htmlFor="Price">Наша цена:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <CurrencyInput
                        name="Price"
                        id="Price"
                        value={props.tender.rebiddingPrices.length == 0 ? props.tender.price : props.tender.rebiddingPrices.at(-1)?.price}
                        className={styles.input}
                        disabled={!props.isEditable.price}
                        allowNegativeValue={false}
                        onValueChange={value => {
                            const result = props.tender.setPrice(value ? value : '')
                            if (!result.ok) {
                                errors['Price'] = result.error
                            } else {
                                delete errors['Price']
                            }
                        }}
                        suffix="₽"
                    />
                    {props.isEditable.price && <FontAwesomeIcon icon={faPenToSquare} className={styles.icon}/>}
                </div>
            </div>
            {errors["Price"] && <><span></span><span className='under-input-error'>{errors["Price"]}</span></>}
            <TenderFormField propertyName="Date1_start" value={props.tender.date1_start} label="Дата начала 1-го этапа:"
                             onChange={handleChange} isEditable={props.isEditable.date1_start} errors={errors}
                             type="datetime-local"/>
            <TenderFormField propertyName="Date1_finish" value={props.tender.date1_finish}
                             label="Дата окончания 1-го этапа:"
                             onChange={handleChange} isEditable={props.isEditable.date1_finish} errors={errors}
                             type="datetime-local"/>
            <TenderFormField propertyName="Date2_finish" value={props.tender.date2_finish}
                             label="Дата окончания 2-го этапа:"
                             onChange={handleChange} isEditable={props.isEditable.date2_finish} errors={errors}
                             type="datetime-local"/>
            <TenderFormField propertyName="Date_finish" value={props.tender.date_finish} label="Подведение итогов:"
                             onChange={handleChange} isEditable={props.isEditable.date_finish} errors={errors}
                             type="datetime-local"/>
            <ContactPersonForm company={props.tender.company} contactPerson={props.tender.contactPerson} errors={errors}
                               isEditable={props.isEditable.contactPerson}/>
        </div>
    )
})

export default TenderForm