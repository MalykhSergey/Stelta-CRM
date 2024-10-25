"use client"
import { useEffect, useState } from 'react';
import TenderCard from './components/TenderCard/TenderCard';
import { Tender } from './models/Tender';
import styles from './page.module.css';
import { getAllTenders } from './models/TenderService';

export default function HomePage() {

  const [tenders, setTenders] = useState<Tender[]>([]);

  useEffect(() => {
    const loadTenders = async () => {
      let tenders = JSON.parse(await getAllTenders())
      setTenders(tenders.map((tender: any) => Tender.fromPlainObject(tender)))
    }
    loadTenders()
  }, []);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>6 Column Layout with Dynamic Cards</h1>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h2>Заявка создана</h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
          <div className={styles.column}>
            <h2>Подготовка заявки <p>1 Этап</p></h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
          <div className={styles.column}>
            <h2>Заявка подана <p>1 Этап</p></h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
          <div className={styles.column}>
            <h2>Подготовка заявки <p>2 Этап</p></h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
          <div className={styles.column}>
            <h2>Заявка подана <p>2 Этап</p></h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
          <div className={styles.column}>
            <h2>Заключение договора</h2>
            {tenders.map((tender, index) => (
              <TenderCard key={index} tender={tender} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};