"use client"
import { PrimaryButton } from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import { getFundingTypeName } from "@/models/Tender/FundingType";
import getStatusName from "@/models/Tender/Status";
import { getTenderTypeName } from "@/models/Tender/TenderType";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "../TendersFilter/TendersFilter.module.css";

export default function TendersSearch() {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const updateParams = (formData: FormData) => {
        const params = new URLSearchParams(searchParams);
        const status = formData.get('status') as string
        const type = formData.get('type') as string
        const funding_type = formData.get('funding_type') as string
        const name = formData.get('name') as string
        const reg_number = formData.get('reg_number') as string
        const company_name = formData.get('company_name') as string
        const start = formData.get('start') as string
        const end = formData.get('end') as string
        params.set('status', status)
        params.set('type', type)
        params.set('funding_type', funding_type)
        params.set('name', name)
        params.set('reg_number', reg_number)
        params.set('company_name', company_name)
        params.set('start', start)
        params.set('end', end)
        router.push(pathname + '?' + params.toString())
    }
    return (
        <form className={styles.filter} onSubmit={e => {
            e.preventDefault()
            updateParams(new FormData(e.currentTarget))
        }}>
            <div className='row' style={{ alignItems: 'center', gap: '20px' }}>
                <FontAwesomeIcon icon={faSearch} className='icon' style={{ height: '20px' }} />
                <h3>Поиск</h3>
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>Статус:</label>
                <select name='status' className='input'>
                    <option value="">Любой</option>
                    <option value="-4">{getStatusName(-4)}</option>
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
            <div>
                <label htmlFor='type' className={styles.filterLabel}>Тип:</label>
                <select name='type' className='input'>
                    <option value="">Любой</option>
                    <option value="0">{getTenderTypeName(0)}</option>
                    <option value="1">{getTenderTypeName(1)}</option>
                    <option value="2">{getTenderTypeName(2)}</option>
                    <option value="3">{getTenderTypeName(3)}</option>
                </select>
            </div>
            <div>
                <label htmlFor='funding_type' className={styles.filterLabel}>Принадлежность:</label>
                <select name='funding_type' className='input'>
                    <option value="">Любая</option>
                    <option value="0">{getFundingTypeName(0)}</option>
                    <option value="1">{getFundingTypeName(1)}</option>
                    <option value="2">{getFundingTypeName(2)}</option>
                </select>
            </div>
            <div className='column'>
                <label htmlFor="filter_name" className={styles.filterLabel}>Наименование:</label>
                <input name='name' id="filter_name" type="text" className={styles.filterInput}
                    placeholder="Наименование" />
            </div>
            <div className='column'>
                <label htmlFor="filter_company" className={styles.filterLabel}>Организация:</label>
                <input name='company_name' id="filter_company" type="text" className={styles.filterInput}
                    placeholder="Название организации" />
            </div>
            <div className='column'>
                <label htmlFor="filter_number" className={styles.filterLabel}>Реестровый номер:</label>
                <input name='reg_number' id="filter_number" type="text" className={styles.filterInput}
                    placeholder="№ ..." />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>От:</label>
                <input name='start' type="date" className='input' />
            </div>
            <div className='column'>
                <label className={styles.filterLabel}>До:</label>
                <input name='end' type="date" className='input' />
            </div>
            <PrimaryButton>Найти</PrimaryButton>
        </form>
    )
}