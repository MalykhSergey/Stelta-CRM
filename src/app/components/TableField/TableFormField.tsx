import styles from '../../tender/TenderForm/TenderForm.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';

interface TableFormFieldProps {
    label: string;
    propertyName: string;
    value: string | number;
    isEditable: boolean;
    type?: string;
    errors: { [key: string]: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const TableFormField = (props: TableFormFieldProps) => {
    return (
        <>
            <label htmlFor={props.propertyName} className={styles.label}>{props.label}</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    {props.type === 'textarea' ? (
                        <textarea
                            id={props.propertyName}
                            name={props.propertyName}
                            value={props.value}
                            disabled={!props.isEditable}
                            onChange={props.onChange}
                            className={styles.input}
                        />
                    ) : (
                        <input
                            type={props.type}
                            id={props.propertyName}
                            name={props.propertyName}
                            value={props.value}
                            disabled={!props.isEditable}
                            onChange={props.onChange}
                            className={styles.input}
                        />
                    )}
                    {props.isEditable && props.type != 'datetime-local' &&
                        <FontAwesomeIcon icon={faPenToSquare} className={styles.icon}/>}
                </div>
            </div>
            {props.errors[props.propertyName] &&
                <>
                    <div></div>
                    <span className='under-input-error'>{props.errors[props.propertyName]}</span></>
            }
        </>
    )
};
