import Company from '@/app/models/Company'
import { default as getStatusName } from '@/app/models/Status'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Tender } from '../../models/Tender'
import styles from './TenderForm.module.css'

interface TenderFormProps {
    tender: Tender,
    companies: Company[],
    isEditable: {
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

const TenderForm: React.FC<TenderFormProps> = observer(({ tender, companies, isEditable }) => {
    const errors: { [key: string]: string } = useLocalObservable(() => ({}))
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (tender as any)["set" + name](value)
        if (!result.ok) {
            errors[name] = result.error
        }
        else {
            delete errors[name]
        }
    }
    const name = renderField("Name", tender.name, 'Наименование тендера:', isEditable.name, errors, handleChange)
    const regNumber = renderField("RegNumber", tender.regNumber, 'Реестровый номер  :', isEditable.regNumber, errors, handleChange)
    const lotNumber = renderField("LotNumber", tender.lotNumber, 'Лот №:', isEditable.lotNumber, errors, handleChange)
    const initialMaxPrice = renderField("InitialMaxPrice", tender.initialMaxPrice, 'НМЦК:', isEditable.initialMaxPrice, errors, handleChange)
    const price = tender.rebiddingPrices.length == 0 ? renderField("Price", tender.price, 'Наша цена:', isEditable.price, errors, handleChange) : renderField("Price", tender.rebiddingPrices.at(-1)?.price, 'Наша цена:', false, errors, handleChange)
    const contactPerson = renderField("ContactPerson", tender.contactPerson, 'Контактное лицо:', isEditable.contactPerson, errors, handleChange)
    const phoneNumber = renderField("PhoneNumber", tender.phoneNumber, 'Тел.:', isEditable.phoneNumber, errors, handleChange)
    const email = renderField("Email", tender.email, 'Email:', isEditable.email, errors, handleChange)
    return (
        <div className={`${styles.form} card`} >
            <label className={styles.label}>Статус:</label>
            <div className={styles.formGroup}>
                <select name="Status" value={tender.status} className={styles.input} onChange={handleChange}>
                    {tender.status < 0 &&
                        <>
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
                <input type="checkbox" name="IsSpecial" id="IsSpecial" checked={tender.isSpecial} onClick={() => tender.toggleIsSpecial()} disabled={!isEditable.isSpecial} />
            </div>
            <label className={styles.label} htmlFor="Company">Организация:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <select name="Company" id="Company" onChange={handleChange}>
                        {companies.map(company =>
                            <option key={"option" + company.id} value={company.id}>{company.name}</option>
                        )}
                    </select>
                </div>
                {errors['Company'] && <span></span>} {errors['Company'] && <span className={styles.error}>{errors['Company']}</span>}
            </div>
            {name}
            {regNumber}
            {lotNumber}
            {initialMaxPrice}
            {price}
            <label className={styles.label} htmlFor='Date1_start'>Дата начала 1-го этапа:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input type="datetime-local" name='Date1_start' id='Date1_start' value={tender.date1_start} onChange={handleChange} disabled={!isEditable.date1_start} />
                </div>
                {errors['Date1_start'] && <span></span>} {errors['Date1_start'] && <span className={styles.error}>{errors['Date1_start']}</span>}
            </div>
            <label className={styles.label} htmlFor='Date1_finish'>Дата окончания 1-го этапа:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input type="datetime-local" name='Date1_finish' id='Date1_finish' value={tender.date1_finish} onChange={handleChange} disabled={!isEditable.date1_finish} />
                </div>
                {errors['Date1_finish'] && <span></span>} {errors['Date1_finish'] && <span className={styles.error}>{errors['Date1_finish']}</span>}
            </div>
            <label className={styles.label} htmlFor='Date2_finish'>Дата окончания 2-го этапа:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input type="datetime-local" name='Date2_finish' id='Date2_finish' value={tender.date2_finish} onChange={handleChange} disabled={!isEditable.date2_finish} />
                </div>
                {errors['Date2_finish'] && <span></span>} {errors['Date2_finish'] && <span className={styles.error}>{errors['Date2_finish']}</span>}
            </div>
            <label className={styles.label} htmlFor='Date_finish'>Подведение итогов:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input type="datetime-local" name='Date_finish' id='Date_finish' value={tender.date_finish} onChange={handleChange} disabled={!isEditable.date_finish} />
                </div>
                {errors['Date_finish'] && <span></span>} {errors['Date_finish'] && <span className={styles.error}>{errors['Date_finish']}</span>}
            </div>
            {contactPerson}
            {phoneNumber}
            {email}
        </div >
    )
})

export default TenderForm
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderField = (fieldName: string, value: any, labelTitle: string, isEditableField: boolean, errors: { [key: string]: string }, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => {
    let elem = <input type="text" className={styles.input} disabled value={value} />
    if (isEditableField) {
        let fieldType = 'text'
        if (fieldName == 'Email')
            fieldType = 'email'
        elem = <>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input
                        type={fieldType}
                        name={fieldName}
                        id={fieldName}
                        value={value}
                        onChange={(e) => {
                            if (["InitialMaxPrice", "Price"].includes(fieldName)) {
                                e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                            }
                            handleChange(e)

                        }}
                        className={styles.input}
                    />
                    <FontAwesomeIcon icon={faPenToSquare} className={styles.icon} />
                </div>
            </div>
            {errors[fieldName] && <span></span>} {errors[fieldName] && <span className='under-input-error'>{errors[fieldName]}</span>}
        </>
    }
    return (
        <>
            <label htmlFor={fieldName} className={styles.label}>{labelTitle}</label>
            {elem}
        </>
    )
}