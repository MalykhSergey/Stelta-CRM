import { default as getStatusName, default as Status } from '@/app/models/Status'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { Tender } from '../../models/Tender'
import styles from './TenderForm.module.css'

interface TenderFormProps {
    tender: Tender,
    isEditable: {
        company: boolean,
        name: boolean,
        regNumber: boolean,
        lotNumber: boolean,
        initialMaxPrice: boolean,
        price: boolean,
        dates: boolean,
        contactPerson: boolean,
        phoneNumber: boolean,
        email: boolean
    }
}

const TenderForm: React.FC<TenderFormProps> = observer(({ tender, isEditable }) => {
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
    const company = renderField("Company", tender.company, 'Организация:', isEditable.company, errors, handleChange)
    const name = renderField("Name", tender.name, 'Наименование тендера:', isEditable.name, errors, handleChange)
    const regNumber = renderField("RegNumber", tender.regNumber, 'Рег. №:', isEditable.regNumber, errors, handleChange)
    const lotNumber = renderField("LotNumber", tender.lotNumber, 'Лот №:', isEditable.lotNumber, errors, handleChange)
    const initialMaxPrice = renderField("InitialMaxPrice", tender.initialMaxPrice, 'НМЦК:', isEditable.initialMaxPrice, errors, handleChange)
    const price = renderField("Price", tender.price, 'Наша цена:', isEditable.price, errors, handleChange)
    const contactPerson = renderField("ContactPerson", tender.contactPerson, 'Контактное лицо:', isEditable.contactPerson, errors, handleChange)
    const phoneNumber = renderField("PhoneNumber", tender.phoneNumber, 'Тел.:', isEditable.phoneNumber, errors, handleChange)
    const email = renderField("Email", tender.email, 'Email:', isEditable.email, errors, handleChange)
    const date1_start = renderField("Date1_start", tender.date1_start, 'Дата и время начала подачи 1 этапа:', isEditable.price, errors, handleChange)
    const date1_finish = renderField("Date1_finish", tender.date1_finish, 'Дата и время окончания подачи 1 этапа:', isEditable.price, errors, handleChange)
    const date2_finish = renderField("Date2_finish", tender.date2_finish, 'Дата и время окончания подачи 2 этапа:', isEditable.price, errors, handleChange)
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
            {company}
            {name}
            {regNumber}
            {lotNumber}
            {initialMaxPrice}
            {price}
            {date1_start}
            {date1_finish}
            {date2_finish}
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
        if (fieldName.includes('Date'))
            fieldType = 'datetime-local'
        if (fieldName == 'Email')
            fieldType = 'email'
        elem = <>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <input
                        type={fieldType}
                        name={fieldName}
                        id={fieldName}
                        value={fieldName === "InitialMaxPrice" || fieldName === "Price"
                            ? value + " ₽"
                            : value
                        }
                        onChange={(e) => {
                            if (["InitialMaxPrice", "Price"].includes(fieldName)) {
                                e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                                const cursorPosition = e.target.selectionStart;
                                requestAnimationFrame(() => {
                                    e.target.selectionStart = cursorPosition;
                                    e.target.selectionEnd = cursorPosition;
                                });
                            }
                            handleChange(e)

                        }}
                        className={styles.input}
                    />
                    {fieldType != 'datetime-local' && <FontAwesomeIcon icon={faPenToSquare} className={styles.icon} />}
                </div>
            </div>
            {errors[fieldName] && <span></span>} {errors[fieldName] && <span className={styles.error}>{errors[fieldName]}</span>}
        </>
    }
    return (
        <>
            <label htmlFor={fieldName} className={styles.label}>{labelTitle}</label>
            {elem}
        </>
    )
}