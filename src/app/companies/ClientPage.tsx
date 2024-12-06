"use client"
import {useState} from "react"
import {showMessage} from "../components/Alerts/Alert"
import styles from "./page.module.css"
import {createCompany, deleteCompany, updateCompany} from "@/models/Company/CompanyService"
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Company from "@/models/Company/Company";

export default function ClientCompanies({companiesProps}: { companiesProps: Company[] }) {
    const [companies, setCompanies] = useState(companiesProps)
    // const companies = companiesProps
    // useEffect(() => {makeAutoObservable(companies)})

    async function createCompanyHandler(formData: FormData) {
        const company_name = formData.get('company') as string
        const result = await createCompany(company_name)
        if (result?.error)
            showMessage(result.error)
        else {
            setCompanies([{id: result as number, name: company_name}, ...companies])
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
            setCompanies(companies.map(company => {
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
            setCompanies(companies.filter(company => company.id != id))
            showMessage("Организация успешно удалена!", "successful")
        }
    }

    return (
        <main className={styles.content}>
            <form action={createCompanyHandler} className={`card fullWidth row ${styles.input}`}>
                <textarea name="company" required/>
                <button className="BlueButton">Добавить</button>
            </form>
            {companies.map(row =>
                <form action={updateHandler} key={'company' + row.id} className={styles.company + ' shadowed'}>
                    <input type="hidden" name='id' defaultValue={row.id}/>
                    <textarea name='name' defaultValue={row.name}/>
                    <button type="submit" className='BlueButton'>Сохранить</button>
                    <button onClick={deleteHandler} type="button" value={row.id} className='iconButton redButton'>
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                </form>)
            }
        </main>
    )
}