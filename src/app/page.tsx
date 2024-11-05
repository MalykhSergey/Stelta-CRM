import { faFilter, faOutdent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TenderCard from './components/TenderCard/TenderCard';
import getStatusName from './models/Status';
import tenderStorage from './models/TenderStorage';
import styles from './page.module.css';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tenders = await tenderStorage.getAll()
  return (
    <main className={styles.content}>
      <div className={styles.leftPanel}>
        <a className={`${styles.columnHeader} ${styles.createTender} card`} href='./tender/create' target='blank'><h3>Добавить</h3><FontAwesomeIcon icon={faOutdent} style={{ width: '20px' }}></FontAwesomeIcon></a>
        <div className={styles.filter}>
          <div className='row' style={{ alignItems: 'center', gap: '20px' }}><FontAwesomeIcon icon={faFilter} className='icon' style={{ width: '20px' }}></FontAwesomeIcon><h3>Фильтр</h3></div>
          <div className='column'>
            <label className={styles.filterLabel}>Статус:</label>
            <select className='input'>
              <option value="0">{getStatusName(0)}</option>
              <option value="1">{getStatusName(1)}</option>
              <option value="2">{getStatusName(2)}</option>
              <option value="3">{getStatusName(3)}</option>
              <option value="4">{getStatusName(4)}</option>
              <option value="5">{getStatusName(5)}</option>
              <option value="6">{getStatusName(6)}</option>
            </select>
          </div>
          <div className='column'>
            <label className={styles.filterLabel}>Реестровый номер:</label>
            <input type="text" className={styles.filterInput} placeholder="№ ..." />
          </div>
          <div className='column'>
            <label className={styles.filterLabel}>Дата:</label>
            <input type="date" className='input' />
          </div>
        </div>
      </div>
      <div className={`${styles.grid} inherit`}>
        <div className={` ${styles.column}`}>
          <div className={`${styles.first} card ${styles.columnHeader}`}>
            <h3>Новый тендер </h3></div>
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
    </main>
  );
};