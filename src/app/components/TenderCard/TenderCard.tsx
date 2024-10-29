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
  let dateField

  switch (props.tender.status) {
    case 0:
      dateField = <></>
      break
    case 1:
      dateField = convertDate(props.tender.date1_start)
      break
    case 2:
      dateField = convertDate(props.tender.date1_finish)
      break
    case 3:
      dateField = convertDate(props.tender.date2_finish)
      break
    case 4:
      break
    case 5:
      break
  }
  return (
    <Link href={`/tender/${props.tender.id}`} className={`fullWidth`}>
      <div className={`card inherit ${styles.hoverCard}`}>
        <div className={styles.title}>{props.tender.name}</div>
        <label className={styles.label}>Рег. №: </label>
        <div className={styles.info}>{props.tender.regNumber}</div>
        <label className={styles.label}>Организация: </label>
        <div className={styles.info}>{props.tender.company}</div>
        <label className={styles.label}>Контактное лицо: </label>
        <div className={styles.info}>{props.tender.contactPerson}</div>
        <label className={styles.label}>Конец этапа: </label>
        {dateField}
      </div>
    </Link>
  );
}
