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
            }, [props.company, props.contactPerson, store]);
            return (
                <>
                    <label htmlFor={styles.ContactPersonName} className={styles.label}>Контактное лицо: </label>
                    <div className={styles.formGroup}>
                        <div className={styles.inputRow} id={style.ContactPersonNameContainer}>
                            <input
                                type='text'
                                id={style.ContactPersonName}
                                name='ContactPersonName'
                                value={store.contactPerson.getName()}
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
                                        <div key={result.getName()} className={style.searchItem} onClick={() => {
                                            store.contactPerson.id = result.id
                                            store.contactPerson.setName(result.getName())
                                            store.contactPerson.setEmail(result.getEmail())
                                            store.contactPerson.setPhoneNumber(result.getPhoneNumber())
                                        }}>{result.getName()}</div>)}
                                </div>
                            </>
                            }
                        </div>
                        {props.errors['ContactPersonName'] &&
                            <span className='under-input-error'>{props.errors['ContactPersonName']}</span>}
                    </div>
                    <TenderFormField
                        propertyName="phoneNumber"
                        value={store.contactPerson.getPhoneNumber()}
                        label="Номер телефона:"
                        isEditable={props.isEditable}
                        onChange={(e) => store.contactPerson.setPhoneNumber(e.target.value)}
                        errors={props.errors}
                    />
                    <TenderFormField
                        propertyName="email"
                        value={store.contactPerson.getEmail()}
                        label="Электронная почта:"
                        isEditable={props.isEditable}
                        onChange={(e) => store.contactPerson.setEmail(e.target.value)}
                        errors={props.errors}
                    />
                    {props.isEditable && (
                        <>
                            <div></div>
                            {store.isNew && <button disabled={false}>
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