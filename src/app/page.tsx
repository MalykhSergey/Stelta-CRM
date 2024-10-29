import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import TenderCard from './components/TenderCard/TenderCard';
import tenderStorage from './models/TenderStorage';
import styles from './page.module.css';

export default async function HomePage() {
  const tenders = await tenderStorage.getAll()
  return (
    <div className={`${styles.grid} inherit`}>
      <div className={` ${styles.column}`}>
        <h3 className={`${styles.first} card ${styles.columnHeader}`}>Заявка создана</h3>
        <Link style={{width:'20px'}} href='./tender/create'><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Link>
        {tenders.filter(tender => tender.status == 0).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
      <div className={`${styles.column}`}>
        <h3 className={`${styles.second} card ${styles.columnHeader}`}>Подготовка 1 Этап</h3>
        {tenders.filter(tender => tender.status == 1).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
      <div className={`${styles.column}`}>
        <h3 className={`${styles.third} card ${styles.columnHeader}`}>Подана 1 Этап</h3>
        {tenders.filter(tender => tender.status == 2).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
      <div className={`${styles.column}`}>
        <h3 className={`${styles.forth} card ${styles.columnHeader}`}>Подготовка 2 Этап</h3>
        {tenders.filter(tender => tender.status == 3).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
      <div className={`${styles.column}`}>
        <h3 className={`${styles.fifth} card ${styles.columnHeader}`}>Подана 2 Этап</h3>
        {tenders.filter(tender => tender.status == 4).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
      <div className={`${styles.column}`}>
        <h3 className={`${styles.sixth} card ${styles.columnHeader}`}>Заключение договора</h3>
        {tenders.filter(tender => tender.status == 5).map((tender, index) => (
          <TenderCard key={index} tender={tender} />
        ))}
      </div>
    </div>
  );
};