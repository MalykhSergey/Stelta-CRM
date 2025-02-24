import Company, {ICompany} from "@/models/Company/Company";
import {ContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeAutoObservable} from "mobx";
import {observer} from "mobx-react-lite";
import {useRef} from "react";
import {DeleteButton} from "../components/Buttons/DeleteButton/DeleteButton";
import {ExpandButton} from "../components/Buttons/ExpandButton/ExpandButton";
import {PrimaryButton} from "../components/Buttons/PrimaryButton/PrimaryButton";
import hidden_form_styles from "../tender/StageForms.module.css";
import {ContactPersonForm} from "./ContactPersonForm/ContactPersonForm";
import styles from "./page.module.css";
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";

interface CompanyItemProps {
    company: Company,
    isAuth: boolean,
    deleteHandler: (id: number) => void,
    updateHandler: (company: ICompany) => void
}

const CompanyItem: React.FC<CompanyItemProps> = observer(({company, isAuth, deleteHandler, updateHandler}) => {
    const company_name = useRef<HTMLDivElement | null>(null)
    return (
        <ExpandableForm key={'company' + company.id} additional_class={styles.company}
                        header={(toggle, isExpanded) => {
                            return (
                                <div className={styles.companyInputs}>
                                    <input type="hidden" name='id' defaultValue={company.id}/>
                                    <div className={hidden_form_styles.cardHeader}>
                                        <div className={styles.companyName} ref={company_name} contentEditable={true}
                                             suppressContentEditableWarning={true}>{company.name}</div>
                                        {isAuth &&
                                            <div className={hidden_form_styles.rightPanel}>
                                                <PrimaryButton onClick={() => {
                                                    if (company_name.current)
                                                        company.name = company_name.current.textContent || company.name
                                                    updateHandler(company)
                                                }} aria-label="Сохранить" type="button"><FontAwesomeIcon
                                                    icon={faCheck}></FontAwesomeIcon></PrimaryButton>
                                                <DeleteButton onClick={() => deleteHandler(company.id)} type="button"
                                                              value={company.id}/>
                                                <ExpandButton onClick={toggle} expanded={!isExpanded}/>
                                            </div>}
                                    </div>
                                </div>
                            )
                        }}>
            <ContactPersonForm company={company} isEditable={isAuth} errors={{}}
                               contactPerson={makeAutoObservable(new ContactPerson(0, '', '', ''))}/>
        </ExpandableForm>
    )
})
export default CompanyItem