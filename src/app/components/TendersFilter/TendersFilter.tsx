import getStatusName from "@/models/Tender/Status";
import { Tender } from "@/models/Tender/Tender";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import styles from "./TendersFilter.module.css";

export default function TendersFilter(props: {
    allTenders: Tender[],
    setTenders: (tenders: Tender[]) => void,
    simpleRange: boolean
}) {
    const status = useRef<HTMLSelectElement | null>(null);
    const regNumber = useRef<HTMLInputElement | null>(null);
    const fullName = useRef<HTMLInputElement | null>(null);
    const company = useRef<HTMLInputElement | null>(null);
    const startDateRange = useRef<HTMLInputElement | null>(null);
    const endDateRange = useRef<HTMLInputElement | null>(null);
    const changeFilter = () => {
        let start_filter_date = 0, end_filter_date = 0
        if (startDateRange.current && startDateRange.current.value != '') {
            start_filter_date = new Date(startDateRange.current.value).getTime()
        }
        if (endDateRange.current && endDateRange.current.value != '') {
            end_filter_date = new Date(endDateRange.current.value).getTime() + 86400000 // + 1 день для "интуитивного понятия до"
        }
        props.setTenders(props.allTenders.filter(tender => {
            let filterFlag = true
            if (status.current && status.current.value != '') {
                if (status.current.value == '-1')
                    if (tender.status == -4 || tender.status > 0)
                        filterFlag = filterFlag && false
                if (status.current.value != tender.status.toString())
                    filterFlag = filterFlag && false
            }
            if (regNumber.current && regNumber.current.value != '')
                if (!tender.regNumber.includes(regNumber.current.value))
                    filterFlag = filterFlag && false
            if (fullName.current && fullName.current.value != '')
                if (!tender.name.toLowerCase().includes(fullName.current.value.toLowerCase()))
                    filterFlag = filterFlag && false
            if (company.current && company.current.value != '')
                if (!tender.company.name.toLowerCase().includes(company.current.value.toLowerCase()))
                    filterFlag = filterFlag && false
            if (props.simpleRange) {
                if (start_filter_date != 0 && tender.statusDate < start_filter_date) {
                    filterFlag = filterFlag && false
                }
                if (end_filter_date != 0 && tender.statusDate > end_filter_date) {
                    filterFlag = filterFlag && false
                }
            } else {
                if (start_filter_date != 0 && tender.startDateRange < start_filter_date) {
                    filterFlag = filterFlag && false
                }
                if (end_filter_date != 0 && tender.endDateRange > end_filter_date) {
                    filterFlag = filterFlag && false
                }
            }
            return filterFlag
        }))
    }
    return (
        <div className={styles.filter}>
            <div className='row' style={{ alignItems: 'center', gap: '20px' }}>
                <FontAwesomeIcon icon={faFilter} className='icon' style={{ height: '20px' }} />
                <h3>Фильтр</h3>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Статус:</label>
                <select ref={status} className='input' onChange={changeFilter}>
                    <option value="">Любой</option>
                    {!props.simpleRange && <option value="-4">{getStatusName(-4)}</option>}
                    {!props.simpleRange && <option value="-1">{getStatusName(-1)}</option>}
                    <option value="0">{getStatusName(0)}</option>
                    <option value="1">{getStatusName(1)}</option>
                    <option value="2">{getStatusName(2)}</option>
                    <option value="3">{getStatusName(3)}</option>
                    <option value="4">{getStatusName(4)}</option>
                    <option value="5">{getStatusName(5)}</option>
                    {!props.simpleRange && <option value="6">{getStatusName(6)}</option>}

                </select>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Полное наименование:</label>
                <input ref={fullName} type="text" className={styles.filterInput} placeholder="Полное наименование"
                    onChange={changeFilter} />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Организация:</label>
                <input ref={company} type="text" className={styles.filterInput} placeholder="Название организации"
                    onChange={changeFilter} />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Реестровый номер:</label>
                <input ref={regNumber} type="text" className={styles.filterInput} placeholder="№ ..."
                    onChange={changeFilter} />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>От:</label>
                <input ref={startDateRange} type="date" className='input' onChange={changeFilter} />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>До:</label>
                <input ref={endDateRange} type="date" className='input' onChange={changeFilter} />
            </div>
        </div>
    )
}