import Link from 'next/link';
import {Tender} from '../../../models/Tender/Tender';
import styles from './TenderCard.module.css';
import "./statuses.css";
import {formatValue} from "react-currency-input-field";

function convertDate(value: string) {
    const convertedDate = new Date(value).toLocaleString().split(',')
    return (
        <>
            <div className={styles.info}>{convertedDate[0]} {convertedDate[1].slice(0, -3)}</div>
        </>)
}

export default function TenderCard(props: { tender: Tender }) {
    let dateSpan
    let dateField
    switch (Math.abs(props.tender.status)) {
        case 0:
            dateField = <></>
            break
        case 1:
            dateField = convertDate(props.tender.date1_start)
            dateSpan = <span className={styles.label}>Начало подачи: </span>
            break
        case 2:
            dateField = convertDate(props.tender.date1_finish)
            dateSpan = <span className={styles.label}>Окончание подачи: </span>
            break
        case 3:
            dateField = convertDate(props.tender.date2_finish)
            dateSpan = <span className={styles.label}>Окончание подачи: </span>
            break
        case 4:
            dateField = convertDate(props.tender.date2_finish)
            dateSpan = <span className={styles.label}>Окончание подачи: </span>
            break
        case 5:
            dateField = convertDate(props.tender.date_finish)
            dateSpan = <span className={styles.label}>Подведение итогов: </span>
            break
        case 6:
            dateField = convertDate(props.tender.date_finish)
            dateSpan = <span className={styles.label}>Подведение итогов: </span>
            break
    }
    return (
        <Link className={`card ${styles.hoverCard}`} href={`/tender/${props.tender.id}`}
              target='_blank'>
            <div className={'indicator status-' + props.tender.status}>{props.tender.isSpecial && '✔'}</div>
            <span className={styles.label}>{props.tender.company.name}</span>
            <div className={styles.indicator}></div>
            <div className={styles.title}>{props.tender.name}</div>
            <span className={styles.label}>НМЦК: </span>
            <div className={styles.info}>{
                formatValue({
                value: props.tender.initialMaxPrice.slice(-2) == '00' ? props.tender.initialMaxPrice.slice(0, -2) : props.tender.initialMaxPrice,
                suffix: '₽',
                groupSeparator: ' ',
                decimalSeparator: ','})}
            </div>
            {dateSpan}
            {dateField}
        </Link>
    );
}
