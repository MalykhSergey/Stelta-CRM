import React, {useEffect} from "react";
import {observer, useLocalObservable} from "mobx-react-lite";
import {TenderFormField} from "@/app/components/TenderForm/TenderFormField";
import {ContactPersonStore} from "@/app/components/TenderForm/ContactPersonForm/ContactPersonStore";
import style from './ContactPersonForm.module.css'
import styles from "@/app/components/TenderForm/TenderForm.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import Company from "@/models/Company/Company";
import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {createContactPerson} from "@/models/Company/ContactPerson/ContactPersonService";
import {showMessage} from "@/app/components/Alerts/Alert";

interface ContactPersonFormProps {
    company: Company
    contactPerson: ContactPerson
    isEditable: boolean
    errors: { [key: string]: string }
}

const ContactPersonForm = observer(
        (props: ContactPersonFormProps) => {
            const store = useLocalObservable(() => new ContactPersonStore(props.company, props.contactPerson))
            useEffect(() => {
                store.company = props.company
                store.contactPerson = props.contactPerson
                store.searchResults = props.company.contactPersons
                if (store.isNew) {
                    store.contactPerson.id = 0
                    store.contactPerson.name = ''
                    store.contactPerson.phoneNumber = ''
                    store.contactPerson.email = ''
                }
            }, [props.company, props.contactPerson, store]);
            const addContactPerson = async () => {
                const contactPerson = new ContactPerson(0, store.contactPerson.name, store.contactPerson.phoneNumber, store.contactPerson.email);
                const contactPersonForm = new FormData()
                contactPersonForm.append('name', contactPerson.name)
                contactPersonForm.append('phone_number', contactPerson.phoneNumber)
                contactPersonForm.append('email', contactPerson.email)
                contactPersonForm.append('company_id', store.company.id.toString())
                const result = await createContactPerson(contactPersonForm)
                if (result.error) {
                    showMessage(result.error)
                    return
                } else
                    showMessage("Новое контактное лицо успешно создано!", 'successful')
                contactPerson.id = result
                store.company.addContactPerson(contactPerson)
            }
            return (
                <>
                    <label htmlFor={styles.ContactPersonName} className={styles.label}>Контактное лицо: </label>
                    <div className={styles.formGroup}>
                        <div className={styles.inputRow} id={style.ContactPersonNameContainer}>
                            <input
                                type='text'
                                id={style.ContactPersonName}
                                name='ContactPersonName'
                                value={store.contactPerson.name}
                                disabled={!props.isEditable}
                                onChange={(e) => {
                                    store.contactPerson.setName(e.target.value)
                                    store.findMatches(e.target.value)
                                }}
                                className={styles.input}
                            />
                            {props.isEditable && <FontAwesomeIcon icon={faChevronUp} id={style.chevronIcon}/>}
                            {store.searchResults.length > 0 && <>
                                <div id={style.searchList}>
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
                        </div>
                        {props.errors['ContactPersonName'] &&
                            <span className='under-input-error'>{props.errors['ContactPersonName']}</span>}
                    </div>
                    <TenderFormField
                        propertyName="phoneNumber"
                        value={store.contactPerson.phoneNumber}
                        label="Номер телефона:"
                        isEditable={props.isEditable}
                        onChange={(e) => store.contactPerson.setPhoneNumber(e.target.value)}
                        errors={props.errors}
                    />
                    <TenderFormField
                        propertyName="email"
                        value={store.contactPerson.email}
                        label="Электронная почта:"
                        isEditable={props.isEditable}
                        onChange={(e) => store.contactPerson.setEmail(e.target.value)}
                        errors={props.errors}
                    />
                    {props.isEditable && (
                        <>
                            <div></div>
                            {store.isNew && <button disabled={false} onClick={addContactPerson}>
                                Добавить контактное лицо
                            </button>}
                        </>
                    )}
                </>
            );
        }
    )
;

export {ContactPersonForm};