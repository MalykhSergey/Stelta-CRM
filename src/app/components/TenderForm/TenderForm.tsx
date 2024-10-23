import { observer, useLocalObservable } from 'mobx-react-lite'
import { Tender } from '../../models/Tender'
import styles from './TenderForm.module.css'
import { Status } from '../../models/Status'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

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
    let errors: { [key: string]: string } = useLocalObservable(() => ({}))
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        let result = (tender as any)["set" + name](value)
        if (!result.ok) {
            errors[name] = result.error
        }
        else {
            delete errors[name]
        }
    }
    const renderField = (fieldName: string, value: any, isEditableField: boolean) => {
        if (isEditableField) {
            return (
                <div className={styles.formGroup}>
                    <div className={styles.inputRow}>
                        <input
                            type={fieldName === "Email" ? "email" : "text"}
                            name={fieldName}
                            value={fieldName === "InitialMaxPrice" || fieldName === "Price"
                                ? value + " ₽"
                                : value
                            }
                            onChange={(e) => {
                                if (["InitialMaxPrice", "Price"].includes(fieldName)) {
                                    e.target.value = e.target.value.replace(/[^0-9,]+|,(?=.*,)/g, '')
                                }
                                handleChange(e)
                                const cursorPosition = e.target.selectionStart;
                                requestAnimationFrame(() => {
                                    e.target.selectionStart = cursorPosition;
                                    e.target.selectionEnd = cursorPosition;
                                });
                            }}
                            className={styles.input}
                        />
                        <FontAwesomeIcon icon={faPenToSquare} className={styles.icon} />
                    </div>
                    {errors[fieldName] && <span className={styles.error}>{errors[fieldName]}</span>}
                </div>
            )
        }
        return <input type="text" className={styles.input} disabled value={value}/>
    }

    const company = renderField("Company", tender.company, isEditable.company)
    const name = renderField("Name", tender.name, isEditable.name)
    const regNumber = renderField("RegNumber", tender.regNumber, isEditable.regNumber)
    const lotNumber = renderField("LotNumber", tender.lotNumber, isEditable.lotNumber)
    const initialMaxPrice = renderField("InitialMaxPrice", tender.initialMaxPrice, isEditable.initialMaxPrice)
    const price = renderField("Price", tender.price, isEditable.price)
    const contactPerson = renderField("ContactPerson", tender.contactPerson, isEditable.contactPerson)
    const phoneNumber = renderField("PhoneNumber", tender.phoneNumber, isEditable.phoneNumber)
    const email = renderField("Email", tender.email, isEditable.email)
    return (
        <form className={styles.form}>
            <label className={styles.label}>Статус:</label>
            <div className={styles.formGroup}>
                <select name="Status" value={tender.status} className={styles.input} onChange={handleChange}>
                    <option value="0">{Status.STAGE_CREATED}</option>
                    <option value="1">{Status.STAGE_1_START}</option>
                    <option value="2">{Status.STAGE_1_FINISH}</option>
                    <option value="3">{Status.STAGE_2_START}</option>
                    <option value="4">{Status.STAGE_2_FINISH}</option>
                    <option value="5">{Status.STAGE_FINISH}</option>
                </select>
            </div>
            <label className={styles.label}>Организация:</label>
            {company}
            <label className={styles.label}>Наименование тендера:</label>
            {name}
            <label className={styles.label}>Рег. №:</label>
            {regNumber}
            <label className={styles.label}>Лот №:</label>
            {lotNumber}
            <label className={styles.label}>НМЦК:</label>
            {initialMaxPrice}
            <label className={styles.label}>Наша цена:</label>
            {price}
            <label className={styles.label}>Dates:</label>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    name="Dates"
                    value={tender.dates}
                    onChange={handleChange}
                    className={styles.input}
                />
                {errors.Dates && <span className={styles.error}>{errors.Dates}</span>}
            </div>

            <label className={styles.label}>Контактное лицо:</label>
            {contactPerson}
            <label className={styles.label}>Тел.:</label>
            {phoneNumber}
            <label className={styles.label}>Email:</label>
            {email}
        </form>
    )
})

export default TenderForm
