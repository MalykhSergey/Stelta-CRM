import getStatusName from "@/models/Tender/Status";
import {Tender} from "@/models/Tender/Tender";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCallback, useEffect, useRef} from "react";
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const debouncedChangeFilter = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            const startDateVal = startDateRange.current?.value;
            const startFilterDate = startDateVal ? new Date(startDateVal).getTime() : 0;
            const endDateVal = endDateRange.current?.value;
            const endFilterDate = endDateVal ? new Date(endDateVal).getTime() + 86400000 : 0; // + 1 день для "интуитивного понятия до"
            const statusVal = status.current?.value;
            const regNumberVal = regNumber.current?.value;
            const fullNameVal = fullName.current?.value?.toLowerCase();
            const companyVal = company.current?.value?.toLowerCase();
            props.setTenders(props.allTenders.filter(tender => {
                if (statusVal) {
                    const isSpecialCase = statusVal === '-1' && (tender.status === -4 || tender.status > 0);
                    const isRegularCase = statusVal !== '-1' && tender.status.toString() !== statusVal;
                    if (isSpecialCase || isRegularCase) return false;
                }
                if (regNumberVal && !tender.regNumber.includes(regNumberVal)) return false;
                if (fullNameVal && !(tender.name.toLowerCase().includes(fullNameVal)||tender.shortName.toLowerCase().includes(fullNameVal))) return false;
                if (companyVal && !tender.company.name.toLowerCase().includes(companyVal)) return false;

                const targetDate = props.simpleRange ? tender.statusDate : tender.startDateRange;
                const endDate = props.simpleRange ? tender.statusDate : tender.endDateRange;
                if (startFilterDate && targetDate < startFilterDate) return false;
                if (endFilterDate && endDate > endFilterDate) return false;

                return true;
            }))
        }, props.allTenders.length > 100 ? 350 : 0)
    }, [props]);

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    return (
        <div className={styles.filter}>
            <div className='row' style={{alignItems: 'center', gap: '20px'}}>
                <FontAwesomeIcon icon={faFilter} className='icon' style={{height: '20px'}}/>
                <h3>Фильтр</h3>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Статус:</label>
                <select ref={status} className='input' onChange={debouncedChangeFilter}>
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
                <label htmlFor="filter_name" className={styles.filterLabel}>Полное наименование:</label>
                <input id="filter_name" ref={fullName} type="text" className={styles.filterInput}
                       placeholder="Наименование"
                       onChange={debouncedChangeFilter}/>
            </div>
            <div className='column'>
                <label htmlFor="filter_company" className={styles.filterLabel}>Организация:</label>
                <input id="filter_company" ref={company} type="text" className={styles.filterInput}
                       placeholder="Название организации"
                       onChange={debouncedChangeFilter}/>
            </div>
            <div className='column'>
                <label htmlFor="filter_number" className={styles.filterLabel}>Реестровый номер:</label>
                <input id="filter_number" ref={regNumber} type="text" className={styles.filterInput} placeholder="№ ..."
                       onChange={debouncedChangeFilter}/>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>От:</label>
                <input ref={startDateRange} type="date" className='input' onChange={debouncedChangeFilter}/>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>До:</label>
                <input ref={endDateRange} type="date" className='input' onChange={debouncedChangeFilter}/>
            </div>
        </div>
    )
}