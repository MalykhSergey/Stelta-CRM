import React from "react";
import {observer, useLocalObservable} from "mobx-react-lite";
import {TenderFormField} from "@/app/components/TenderForm/TenderFormField";
import style from './ContactPersonForm.module.css'
import styles from "@/app/components/TenderForm/TenderForm.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import Company from "@/models/Company/Company";
import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {deleteContactPerson, updateContactPerson} from "@/models/Company/ContactPerson/ContactPersonService";
import {showMessage} from "@/app/components/Alerts/Alert";
import {ContactPersonStore} from "@/app/components/TenderForm/ContactPersonForm/ContactPersonStore";

interface ContactPersonFormProps {
    company: Company
    contactPerson: ContactPerson
    isEditable: boolean
    errors: { [key: string]: string }
}

const ContactPersonForm = observer(
        (props: ContactPersonFormProps) => {
            const store = useLocalObservable(() => new ContactPersonStore(props.company, props.contactPerson))
            const saveContactPersonHandler = async () => {
                const newContactPerson = new ContactPerson(store.contactPerson.id, store.contactPerson.name, store.contactPerson.phoneNumber, store.contactPerson.email);
                const oldContactPerson = store.company.contactPersons.find(value => newContactPerson.id == value.id)
                const contactPersonForm = new FormData()
                contactPersonForm.append('id', newContactPerson.id.toString())
                contactPersonForm.append('name', newContactPerson.name)
                contactPersonForm.append('phone_number', newContactPerson.phoneNumber)
                contactPersonForm.append('email', newContactPerson.email)
                contactPersonForm.append('company_id', store.company.id.toString())
                const result = await updateContactPerson(contactPersonForm)
                if (result?.error) {
                    showMessage(result.error)
                    if (oldContactPerson) {
                        store.contactPerson.id = oldContactPerson.id
                        store.contactPerson.setName(oldContactPerson.name)
                        store.contactPerson.setEmail(oldContactPerson.email)
                        store.contactPerson.setPhoneNumber(oldContactPerson.phoneNumber)
                    }
                    return
                } else {
                    showMessage("Контактное лицо успешно сохранено!", 'successful')
                }
                oldContactPerson?.setName(newContactPerson.name)
                oldContactPerson?.setPhoneNumber(newContactPerson.phoneNumber)
                oldContactPerson?.setEmail(newContactPerson.email)
            }
            const deleteContactPersonHandler = async () => {
                const result = await deleteContactPerson(store.contactPerson.id)
                if (result?.error) {
                    showMessage(result.error)
                    return
                } else {
                    showMessage("Контактное лицо успешно удалено!", 'successful')
                    store.company.contactPersons = store.company.contactPersons.filter(value => value.id != store.contactPerson.id)
                    store.contactPerson.id = 0
                    store.contactPerson.name = ''
                    store.contactPerson.phoneNumber = ''
                    store.contactPerson.email = ''
                }
            }
            return (
                <div className={style.form}>
                    <div className={`${style.formGroup} ${style.ContactPersonNameContainer}`}>
                        <label htmlFor={style.ContactPersonName+store.company.id} className={styles.label}>Контактное лицо: </label>
                        <input
                            type='text'
                            id={style.ContactPersonName+store.company.id}
                            className={`${style.ContactPersonName} ${styles.input}`}
                            name={style.ContactPersonName+store.company.id}
                            value={store.contactPerson.name}
                            onChange={(e) => {
                                const result = store.contactPerson.setName(e.target.value);
                                if (result.error)
                                    props.errors["ContactPersonName"+store.company.id] = result.error
                                else
                                    props.errors["ContactPersonName"+store.company.id] = ''
                            }}
                            autoComplete="off"
                        />
                        <FontAwesomeIcon icon={faChevronUp} className={style.chevronIcon}/>
                        {store.searchResults.length > 0 && <>
                            <div className={style.searchList}>
                                {store.searchResults.map(result =>
                                    <div key={result.id} className={style.searchItem} onClick={() => {
                                        store.contactPerson.id = result.id
                                        store.contactPerson.setName(result.name)
                                        store.contactPerson.setEmail(result.email)
                                        store.contactPerson.setPhoneNumber(result.phoneNumber)
                                    }}>{result.name}</div>)}
                            </div>
                        </>
                        }
                        {props.errors['ContactPersonName'+store.company.id]&& props.isEditable && 
                            <span className='under-input-error'>{props.errors['ContactPersonName'+store.company.id]}</span>}
                    </div>
                    <div className={style.formGroup}>
                        <TenderFormField
                            propertyName={`phoneNumber${store.company.id}`}
                            value={store.contactPerson.phoneNumber}
                            label="Номер телефона:"
                            isEditable={props.isEditable}
                            onChange={(e) => {
                                const result = store.contactPerson.setPhoneNumber(e.target.value)
                                if (result.error)
                                    props.errors["phoneNumber"+store.company.id] = result.error
                                else
                                    props.errors["phoneNumber"+store.company.id] = ''
                            }}
                            errors={props.errors}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <TenderFormField
                            propertyName={`email${store.company.id}`}
                            value={store.contactPerson.email}
                            label="Электронная почта:"
                            isEditable={props.isEditable}
                            type="email"
                            onChange={(e) => {
                                const result = store.contactPerson.setEmail(e.target.value)
                                if (result.error)
                                    props.errors["email"+store.company.id] = result.error
                                else
                                    props.errors["email"+store.company.id] = ''
                            }}
                            errors={props.errors}
                        />
                    </div>

                    {props.isEditable && (
                        <>
                            <div></div>
                            {store.isNew && store.contactPerson.isValid && <button disabled={false} onClick={saveContactPersonHandler}>
                                Сохранить
                            </button>}
                            <div></div>
                            {!store.isNew && <button disabled={false} onClick={deleteContactPersonHandler}>
                                Удалить
                            </button>}
                        </>
                    )}
                </div>
            );
        }
    )
;

export {ContactPersonForm};