"use client"
import {faFilter, faOutdent} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
import {showMessage} from './components/Alerts/Alert';
import TenderCard from './components/TenderCard/TenderCard';
import getStatusName from '../models/Status';
import {Tender} from '../models/Tender';
import {createTender} from '../models/TenderService';
import styles from './page.module.css';

export function HomePageClient({tendersJSON}: { tendersJSON: string }) {
    const allTenders = JSON.parse(tendersJSON) as Tender[]
    const [tenders, setTenders] = useState(allTenders)
    const status = useRef<HTMLSelectElement | null>(null);
    const regNumber = useRef<HTMLInputElement | null>(null);
    const date = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const changeFilter = () => {
        setTenders(allTenders.filter(tender => {
            let filterFlag = true
            if (status.current && status.current.value != '')
                if (status.current.value != tender.status.toString())
                    filterFlag = filterFlag && false
            if (regNumber.current && regNumber.current.value != '')
                if (tender.regNumber.includes(regNumber.current.value))
                    filterFlag = filterFlag && false
            if (date.current && date.current.value != '')
                if (tender.date1_start.slice(0, 10) != date.current.value && tender.date1_finish.slice(0, 10) != date.current.value || tender.date2_finish.slice(0, 10) != date.current.value)
                    filterFlag = filterFlag && false
            return filterFlag
        }))
    }
    const createHandler = async () => {
        const id = await createTender()
        if (id.error)
            showMessage(id.error);
        else
            router.push(`/tender/${id}`)
    }
    return (
        <main className={styles.content}>
            <div className={styles.leftPanel}>
                <button className={`${styles.columnHeader} ${styles.createTender}  rounded shadowed`}
                        onClick={createHandler}><span>Добавить тендер</span><FontAwesomeIcon icon={faOutdent}
                                                                                             style={{height: '20px'}}></FontAwesomeIcon>
                </button>
                <div className={styles.filter}>
                    <div className='row' style={{alignItems: 'center', gap: '20px'}}><FontAwesomeIcon icon={faFilter}
                                                                                                      className='icon'
                                                                                                      style={{height: '20px'}}></FontAwesomeIcon>
                        <h3>Фильтр</h3></div>
                    <div className='column'>
                        <label className={styles.filterLabel}>Статус:</label>
                        <select ref={status} className='input' onChange={changeFilter}>
                            <option value="">Любой</option>
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
                        <input ref={regNumber} type="text" className={styles.filterInput} placeholder="№ ..."
                               onChange={changeFilter}/>
                    </div>
                    <div className='column'>
                        <label className={styles.filterLabel}>Дата:</label>
                        <input ref={date} type="date" className='input' onChange={changeFilter}/>
                    </div>
                </div>
            </div>
            <div className={`${styles.grid} inherit`}>
                <div className={` ${styles.column}`}>
                    <div className={`${styles.columnHeader}  rounded shadowed`} id={styles.first}>
                        <h3>Новый тендер </h3></div>
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
            </div>
        </main>
    );
}