"use client"
import { useRef, useState } from "react"
import { showMessage } from "../components/Alerts/Alert"
import styles from "./page.module.css"
import { createCompany } from "../models/CompanyService"
export default function ClientCompanies({ companiesProps }: { companiesProps: Array<{ id: number, name: string }> }) {
    const [companies, setCompanies] = useState(companiesProps)
    const company_name = useRef<HTMLInputElement | null>(null)
    async function createCompanyHandler() {
        if (company_name.current && company_name.current.value != '') {
            const result = await createCompany(company_name.current.value)
            if (result?.error)
                showMessage(result.error)
            else {
                setCompanies([...companies, { id: result, name: company_name.current.value }])
                showMessage("Организация успешно добавлена!", "successful")
            }
        }
    }
    return (
        <main className={styles.content}>
            <div className={`card row ${styles.input}`}>
                <input ref={company_name} type="text" list="companies" name="company" />
                <button className="BlueButton" onClick={createCompanyHandler}>Добавить</button>
                <datalist id="companies">
                    {companies.map(row => <option key={'option' + row.id} company-id={row.id} value={row.name}></option>)}
                </datalist>
            </div>
            {companies.map(row => <div key={'company' + row.id} className="card" company-id={row.id}>{row.name}</div>)}
        </main>
    )
}