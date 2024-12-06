"use client"
import {faOutdent} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {showMessage} from './components/Alerts/Alert';
import TenderCard from './components/TenderCard/TenderCard';
import {Tender} from '@/models/Tender/Tender';
import {createTender} from '@/models/Tender/TenderService';
import styles from './page.module.css';
import TendersFilter from "@/app/components/TendersFilter/TendersFilter";

export function HomePageClient({tendersJSON}: { tendersJSON: string }) {
    const allTenders = JSON.parse(tendersJSON) as Tender[]
    const [tenders, setTenders] = useState(allTenders)
    const router = useRouter();

    const createHandler = async () => {
        const id = await createTender()
        if (id.error)
            showMessage(id.error);
        else
            router.push(`/tender/${id}`)
    }
    return (
        <main className={`${styles.grid}`}>
            <div className={styles.leftPanel}>
                <button className={`${styles.columnHeader} ${styles.createTender}  rounded shadowed`}
                        onClick={createHandler}><span>Добавить тендер</span><FontAwesomeIcon icon={faOutdent}
                                                                                             style={{height: '20px'}}></FontAwesomeIcon>
                </button>
                <TendersFilter allTenders={allTenders} setTenders={setTenders} hideOtherStatuses={true}/>
            </div>
            <div className={` ${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.first}>Новый тендер </h3>
                {tenders.filter(tender => tender.status == 0).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
            <div className={`${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.second}>Подготовка 1 Этап</h3>
                {tenders.filter(tender => tender.status == 1).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
            <div className={`${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.third}>Подана 1 Этап</h3>
                {tenders.filter(tender => tender.status == 2).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
            <div className={`${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.forth}>Подготовка 2 Этап</h3>
                {tenders.filter(tender => tender.status == 3).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
            <div className={`${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.fifth}>Подана 2 Этап</h3>
                {tenders.filter(tender => tender.status == 4).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
            <div className={`${styles.column}`}>
                <h3 className={`${styles.columnHeader}  rounded shadowed`} id={styles.sixth}>Заключение
                    договора</h3>
                {tenders.filter(tender => tender.status == 5).map((tender, index) => (
                    <TenderCard key={index} tender={tender}/>
                ))}
            </div>
        </main>
    );
}