import { ContactPersonStore } from "@/app/tender/TenderForm/ContactPersonForm/ContactPersonStore";
import styles from "@/app/tender/TenderForm/TenderForm.module.css";
import { TenderFormField } from "@/app/tender/TenderForm/TenderFormField";
import Company from "@/models/Company/Company";
import { ContactPerson } from "@/models/Company/ContactPerson/ContactPerson";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import style from './ContactPersonForm.module.css';

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
            store.checkOnNew()
        }, [props.company, store]);
        return (
            <>
                <label htmlFor={style.ContactPersonName} className={styles.label}>Контактное лицо: </label>
                <div className={styles.formGroup}>
                    <div className={styles.inputRow} id={style.ContactPersonNameContainer}>
                        <input
                            type='search'
                            id={style.ContactPersonName}
                            name='ContactPersonName'
                            value={store.contactPerson.name}
                            disabled={!props.isEditable}
                            onChange={(e) => {
                                store.contactPerson.setName(e.target.value)
                                store.checkOnNew()
                            }}
                            className={styles.input}
                        />
                        {props.isEditable && <FontAwesomeIcon icon={faChevronUp} id={style.chevronIcon} />}
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
                    onChange={(e) => {
                        store.contactPerson.setPhoneNumber(e.target.value)
                        store.checkOnNew()
                    }}
                    errors={props.errors}
                />
                <TenderFormField
                    propertyName="email"
                    value={store.contactPerson.email}
                    label="Электронная почта:"
                    isEditable={props.isEditable}
                    onChange={(e) => {
                        store.contactPerson.setEmail(e.target.value)
                        store.checkOnNew()
                    }}
                    errors={props.errors}
                />
            </>
        );
    }
)
    ;

export { ContactPersonForm };

