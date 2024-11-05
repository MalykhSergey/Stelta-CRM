import Link from 'next/link';
import { Tender } from '../../models/Tender';
import styles from './TenderCard.module.css';
function convertDate(value: string) {
  const convertedDate = new Date(value).toLocaleString().split(',')
  return (
    <>
      <div className={styles.info}>{convertedDate[1].slice(0, -3)} {convertedDate[0]}</div>
    </>)
}
export default function TenderCard(props: { tender: Tender }) {
  let dateLabel
  let dateField

  switch (props.tender.status) {
    case 0:
      dateField = <></>
      break
    case 1:
      dateField = convertDate(props.tender.date1_start)
      dateLabel = <label className={styles.label}>Начало подачи: </label>
      break
    case 2:
      dateField = convertDate(props.tender.date1_finish)
      dateLabel = <label className={styles.label}>Окончание подачи: </label>
      break
    case 3:
      dateField = convertDate(props.tender.date2_finish)
      dateLabel = <label className={styles.label}>Окончание подачи: </label>
      break
    case 4:
      dateField = convertDate(props.tender.date2_finish)
      dateLabel = <label className={styles.label}>Окончание подачи: </label>
      break
    case 5:
      break
  }
  return (
    <Link className={`card inherit fullWidth ${styles.hoverCard}`} href={`/tender/${props.tender.id}`}target='_blank'>
      <div>
        <label className={styles.label}>{props.tender.company}</label>
        <div className={styles.title}>{props.tender.name}</div>
        <label className={styles.label}>НМЦК: </label>
        <div className={styles.info}>{props.tender.initialMaxPrice+" ₽"}</div>
        {props.tender.status > 0 && props.tender.status < 5 &&
          <>
            {dateLabel}
            {dateField}
          </>
        }
      </div>
    </Link>
  );
}
