// components/Card.js
import Link from 'next/link';
import { Tender } from '../../models/Tender';
import styles from './TenderCard.module.css';

export default function TenderCard(props: { tender: Tender }) {
  return (
    <Link href={`/tender/${props.tender.id}`}>
      <div className={styles.card}>
        <p>{props.tender.status}</p>
        <p>{props.tender.name}</p>
        <p>{props.tender.company}</p>
        <p>{props.tender.date1_start}</p>
        <p>{props.tender.date1_finish}</p>
        <p>{props.tender.date2_finish}</p>
      </div>
    </Link>
  );
}
