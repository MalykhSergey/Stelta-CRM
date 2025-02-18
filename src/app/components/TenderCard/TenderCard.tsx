import Link from 'next/link';
import { formatValue } from "react-currency-input-field";
import { Tender } from '../../../models/Tender/Tender';
import styles from './TenderCard.module.css';
import "./statuses.css";

function convertDate(value: string) {
    const tender_date = new Date(value)
    const now_date = new Date()
    const diffMs = tender_date.getTime() - now_date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
    let date_hot_style = ""
    if (diffDays > 0 && diffDays < 4)
        date_hot_style = styles[`hot-${diffDays}`]
    const converted_date = tender_date.toLocaleString().split(',')
    return (
        <>
            <div className={`${styles.info} ${date_hot_style}`}>{converted_date[0]} {converted_date[1].slice(0, -3)}</div>
        </>)
}

const MAX_TITLE_LENGTH = 100

function reduceTitle(title: string): { begin: string, middle: string, end: string } {
    if (title.length <= MAX_TITLE_LENGTH)
        return { begin: title, middle: "", end: "" }
    const words = title.split(' ')
    if (words.length <= 5)
        return { begin: title, middle: "", end: "" }
    let begin_index = 1
    let end_index = 3
    let sum: number = words[0].length + words[1].length + words[words.length - 3].length + words[words.length - 2].length + words[words.length - 1].length
    while (true) {
        if (sum >= MAX_TITLE_LENGTH || words.length <= begin_index + end_index)
            break
        end_index++
        sum += words[words.length - end_index].length
        if (sum >= MAX_TITLE_LENGTH || words.length <= begin_index + end_index)
            break
        begin_index++
        sum += words[begin_index].length
    }
    return { begin: words.slice(0, begin_index).join(' '), middle: " " + words.slice(begin_index, words.length - end_index).join(' ') + " ", end: words.slice(words.length - end_index).join(' ') }
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
    const title = reduceTitle(props.tender.name);
    return (
        <Link className={`card ${styles.hoverCard}`} href={`/tender/${props.tender.id}`}
            target='_blank'>
            <div className={'indicator status-' + props.tender.status}>{props.tender.isSpecial && '✔'}</div>
            <span className={styles.label}>{props.tender.company.name}</span>
            <div className={styles.indicator}></div>
            <div className={styles.title}>
                {title.begin}
                {title.middle != "" && <span className={styles.titleMiddle} full-text={title.middle} />}
                {title.end}
            </div>
            <span className={styles.label}>НМЦК: </span>
            <div className={styles.info}>{
                formatValue({
                    value: props.tender.initialMaxPrice.slice(-2) == '00' ? props.tender.initialMaxPrice.slice(0, -2) : props.tender.initialMaxPrice,
                    suffix: '₽',
                    groupSeparator: ' ',
                    decimalSeparator: ','
                })}
            </div>
            {dateSpan}
            {dateField}
        </Link>
    );
}
