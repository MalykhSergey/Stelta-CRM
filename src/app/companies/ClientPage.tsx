"use client"
import { PrimaryButton } from "@/app/components/Buttons/PrimaryButton/PrimaryButton"
import Company, { ICompany } from "@/models/Company/Company"
import { createCompany, deleteCompany, updateCompany } from "@/models/Company/CompanyService"
import { Role } from "@/models/User/User"
import { useState } from "react"
import { useAuth } from "../AuthContext"
import { showMessage } from "../components/Alerts/Alert"
import CompanyItem from "./CompanyItem"
import styles from "./page.module.css"

export default function ClientCompanies({ companiesProps }: { companiesProps: string }) {
    const [companies, setCompanies] = useState(Company.fromJSONArray(companiesProps))
    const auth = useAuth()
    const isAuth = auth.user.name != "" && auth.user.role != Role.Viewer
    async function createCompanyHandler(formData: FormData) {
        const company_name = formData.get('company') as string
        const result = await createCompany(company_name)
        if (result?.error)
            showMessage(result.error)
        else {
            setCompanies([new Company(result as number, company_name), ...companies])
            showMessage("Организация успешно добавлена!", "successful")
        }

    }

    async function updateHandler(updated_company: ICompany) {
        const result = await updateCompany({...updated_company})
        if (result?.error)
            showMessage(result.error)
        else {
            setCompanies(companies.map((company: Company) => {
                if (company.id == updated_company.id)
                    company.name = updated_company.name
                return company
            }))
            showMessage("Организация успешно обновлена!", "successful")
        }
    }

    async function deleteHandler(id: number) {
        const result = await deleteCompany(id)
        if (result?.error)
            showMessage(result.error)
        else {
            setCompanies(companies.filter((company: Company) => company.id != id))
            showMessage("Организация успешно удалена!", "successful")
        }
    }

    return (
        <main className={styles.content}>
            <h1 id={styles.header}>Организации</h1>
            {isAuth &&
                <div className={styles.addCompany + ' card'}>
                    <h3>Добавить организацию</h3>
                    <form action={createCompanyHandler} className={`row ${styles.input}`} aria-label="Добавить организацию">
                        <textarea name="company" required />
                        <PrimaryButton>Добавить</PrimaryButton>
                    </form>
                </div>
            }
            <div className={styles.companies}>
                {companies.map((row: Company) => <CompanyItem key={row.id} company={row} isAuth={isAuth} updateHandler={updateHandler} deleteHandler={deleteHandler} />)
                }
            </div>
        </main>
    )
}