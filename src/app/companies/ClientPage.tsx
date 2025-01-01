"use client"
import { ContactPersonForm } from "@/app/companies/ContactPersonForm/ContactPersonForm"
import { DeleteButton } from "@/app/components/Buttons/DeleteButton/DeleteButton"
import { PrimaryButton } from "@/app/components/Buttons/PrimaryButton/PrimaryButton"
import Company from "@/models/Company/Company"
import { createCompany, deleteCompany, updateCompany } from "@/models/Company/CompanyService"
import { ContactPerson } from "@/models/Company/ContactPerson/ContactPerson"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeAutoObservable } from "mobx"
import { useState } from "react"
import { useAuth } from "../AuthContext"
import { showMessage } from "../components/Alerts/Alert"
import styles from "./page.module.css"

export default function ClientCompanies({ companiesProps }: { companiesProps: string }) {
    const [companies, setCompanies] = useState(Company.fromJSONArray(companiesProps))
    const auth = useAuth()
    const isAuth = !!auth.userName
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

    async function updateHandler(formData: FormData) {
        const result = await updateCompany(formData)
        if (result?.error)
            showMessage(result.error)
        else {
            const id = Number.parseInt(formData.get('id') as string)
            const name = formData.get('name') as string
            setCompanies(companies.map((company: Company) => {
                if (company.id == id)
                    company.name = name
                return company
            }))
            showMessage("Организация успешно обновлена!", "successful")
        }
    }

    async function deleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
        const id = Number.parseInt(e.currentTarget.value);
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
                {companies.map((row: Company) =>
                    <div key={'company' + row.id} className={styles.company + ' card'}>
                        <form action={updateHandler} className={styles.companyInputs}>
                            <input type="hidden" name='id' defaultValue={row.id} />
                            <textarea name='name' defaultValue={row.name} />
                            {isAuth &&
                                <>
                                    <PrimaryButton aria-label="Сохранить" type="submit"><FontAwesomeIcon
                                        icon={faCheck}></FontAwesomeIcon></PrimaryButton>
                                    <DeleteButton onClick={deleteHandler} type="button" value={row.id} />
                                </>}
                        </form>
                        <ContactPersonForm company={row} isEditable={isAuth} errors={{}}
                            contactPerson={makeAutoObservable(new ContactPerson(0, '', '', ''))} />
                    </div>
                )
                }
            </div>
        </main>
    )
}