"use client"
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRef, useState} from "react";
import TenderCard from "../components/TenderCard/TenderCard";
import getStatusName from "../models/Status";
import {Tender} from "../models/Tender";
import styles from "./page.module.css";


export default function SearchPage({tendersJSON}: { tendersJSON: string }) {
    const allTenders = JSON.parse(tendersJSON) as Tender[]
    const [tenders, setTenders] = useState(allTenders)
    const status = useRef<HTMLSelectElement | null>(null);
    const regNumber = useRef<HTMLInputElement | null>(null);
    const fullName = useRef<HTMLInputElement | null>(null);
    const company = useRef<HTMLInputElement | null>(null);
    const date = useRef<HTMLInputElement | null>(null);
    const changeFilter = () => {
        setTenders(allTenders.filter(tender => {
            let filterFlag = true
            if (status.current && status.current.value != '')
                if (status.current.value != tender.status.toString())
                    filterFlag = filterFlag && false
            if (regNumber.current && regNumber.current.value != '')
                if (!tender.regNumber.includes(regNumber.current.value))
                    filterFlag = filterFlag && false
            if (fullName.current && fullName.current.value != '')
                if (!tender.name.toLowerCase().includes(fullName.current.value.toLowerCase()))
                    filterFlag = filterFlag && false
            if (company.current && company.current.value != '')
                if (!tender.company.name.toLowerCase().includes(company.current.value.toLowerCase()))
                    filterFlag = filterFlag && false
            if (date.current && date.current.value != '')
                if (tender.date1_start.slice(0, 10) != date.current.value && tender.date1_finish.slice(0, 10) != date.current.value || tender.date2_finish.slice(0, 10) != date.current.value)
                    filterFlag = filterFlag && false
            return filterFlag
        }))
    }
    return (
        <main className={styles.content}>
            <div className={styles.filter}>
                <div className='row' style={{alignItems: 'center', gap: '20px'}}><FontAwesomeIcon
                    icon={faMagnifyingGlass} className='icon' style={{height: '20px'}}></FontAwesomeIcon><h3>Поиск</h3>
                </div>
                <div className='column'>
                    <label className={styles.filterLabel}>Статус:</label>
                    <select ref={status} className='input' onChange={changeFilter}>
                        <option value="">Любой</option>
                        <option value="-1">{getStatusName(-1)}</option>
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
                    <label className={styles.filterLabel}>Полное наименование:</label>
                    <input ref={fullName} type="text" className={styles.filterInput} placeholder="Полное наименование"
                           onChange={changeFilter}/>
                </div>
                <div className='column'>
                    <label className={styles.filterLabel}>Организация:</label>
                    <input ref={company} type="text" className={styles.filterInput} placeholder="Название организации"
                           onChange={changeFilter}/>
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
            <div className={styles.tenders}>
                {tenders.map(tender => <TenderCard tender={tender} key={tender.id}/>)}
            </div>
        </main>
    )
}