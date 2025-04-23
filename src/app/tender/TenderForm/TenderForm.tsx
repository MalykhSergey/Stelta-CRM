import {default as getStatusName} from '@/models/Tender/Status'
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {observer, useLocalObservable} from 'mobx-react-lite'
import styles from './TenderForm.module.css'
import CurrencyInput from "react-currency-input-field";
import {TableFormField} from "@/app/components/TableField/TableFormField";
import {ContactPersonForm} from "@/app/tender/TenderForm/ContactPersonForm/ContactPersonForm";
import {FundingType, getFundingTypeName} from "@/models/Tender/FundingType";
import {getTenderTypeName, TenderType} from "@/models/Tender/TenderType";
import TenderFlowService from "@/app/tender/[tenderId]/TenderFlowService";
import DropDownList from "@/app/components/DropDownList/DropDownList";
import ParentContract from "@/models/Tender/ParentContract";

interface TenderFormProps {
    tenderFlowService: TenderFlowService,
}

const TenderForm = observer((props: TenderFormProps) => {
    const tender = props.tenderFlowService.tender
    const companies = props.tenderFlowService.companies
    const errors: { [key: string]: string } = useLocalObservable(() => ({}))
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (tender as any)["set" + name](value)
        if (!result.ok) {
            errors[name] = result.error
        } else {
            delete errors[name]
        }
    }
    const isEditable = props.tenderFlowService.isEditable();
    return (
        <div className={`${styles.form} card`}>
            <label className={styles.label} htmlFor='Status'>Статус:</label>
            <div className={styles.formGroup}>
                <select id='Status' name="Status" value={tender.status} className={styles.input}
                        onChange={handleChange}
                        disabled={!isEditable.status}>
                    {tender.status < 0 &&
                        <>
                            <option value="-4">{getStatusName(-4)}</option>
                            <option value="-1">{getStatusName(-1)}</option>
                        </>
                    }
                    <option value="0">{getStatusName(0)}</option>
                    <option value="1">{getStatusName(1)}</option>
                    <option value="2">{getStatusName(2)}</option>
                    <option value="3">{getStatusName(3)}</option>
                    <option value="4">{getStatusName(4)}</option>
                    <option value="5">{getStatusName(5)}</option>
                    <option value="6">{getStatusName(6)}</option>
                </select>
            </div>
            <label className={styles.label} htmlFor='Type'>Тип:</label>
            <div className={styles.formGroup}>
                <select id='Type' name="Type" value={tender.type} className={styles.input}
                        onChange={(event) => {
                            props.tenderFlowService.changeType(parseInt(event.currentTarget.value))
                        }}
                        disabled={!isEditable.type}>
                    <option value="0">{getTenderTypeName(TenderType.Tender)}</option>
                    <option value="1">{getTenderTypeName(TenderType.Special)}</option>
                    <option value="2">{getTenderTypeName(TenderType.Order)}</option>
                    <option value="3">{getTenderTypeName(TenderType.Offer)}</option>
                </select>
            </div>
            <label className={styles.label} htmlFor='FundingType'>Принадлежность:</label>
            <div className={styles.formGroup}>
                <select id='FundingType' name="FundingType" value={tender.fundingType} className={styles.input}
                        onChange={handleChange}
                        disabled={!isEditable.fundingType}>
                    <option value="0">{getFundingTypeName(FundingType.Low)}</option>
                    <option value="1">{getFundingTypeName(FundingType.High)}</option>
                    <option value="2">{getFundingTypeName(FundingType.Budget)}</option>
                </select>
            </div>
            <label className={styles.label} htmlFor="Company">Организация:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <select name="Company" id="Company"
                            onChange={(e) => {
                                const selected_company = companies.find(company => company.id == Number.parseInt(e.currentTarget.value));
                                if (selected_company)
                                    tender.setCompany(selected_company);
                            }}
                            value={tender.company.id}
                            disabled={!isEditable.company}>
                        <option key={"option0"} value={0} disabled={true}>Выберите организацию</option>
                        {companies.map(company =>
                            <option key={"option" + company.id} value={company.id}>{company.name}</option>
                        )}
                    </select>
                </div>
                {errors['Company'] && <span></span>} {errors['Company'] &&
                <span className={styles.error}>{errors['Company']}</span>}
            </div>
            <TableFormField propertyName="ShortName" value={tender.shortName} label="Сокращённое наименование:"
                            onChange={handleChange} isEditable={isEditable.shortName} errors={errors}
                            type="text"/>
            <TableFormField propertyName="Name" value={tender.name} label="Полное наименование:"
                            onChange={handleChange} isEditable={isEditable.name} errors={errors}
                            type="textarea"/>
            {tender.type != TenderType.Order &&
                <TableFormField propertyName={'RegNumber'} value={tender.regNumber} label={"Реестровый номер  :"}
                                onChange={handleChange} isEditable={isEditable.regNumber} errors={errors}/>}
            {tender.type != TenderType.Order &&
                <TableFormField propertyName={'LotNumber'} value={tender.lotNumber} label={"Лот номер:"}
                                onChange={handleChange} isEditable={isEditable.lotNumber} errors={errors}/>
            }
            {tender.type == TenderType.Order &&
                <>
                    <label className={styles.label}>Договор:</label>
                    <div className={styles.formGroup}>
                        <DropDownList items={props.tenderFlowService.parent_contracts}
                                      keyField={'parent_id'}
                                      labelField={'contract_number'}
                                      onSelect={value => tender.setParentContract(value)}
                                      defaultValue={tender.parentContract.contract_number}
                                      emptyValue={new ParentContract(undefined,'')}
                                      disabled={!isEditable.parentContract}/>
                    </div>
                </>
            }

            <label className={styles.label} htmlFor="InitialMaxPrice">НМЦК:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <CurrencyInput
                        name="InitialMaxPrice"
                        id="InitialMaxPrice"
                        value={tender.initialMaxPrice}
                        className={styles.input}
                        disabled={!isEditable.initialMaxPrice}
                        allowNegativeValue={false}
                        onValueChange={value => {
                            const result = tender.setInitialMaxPrice(value ? value : '')
                            if (!result.ok) {
                                errors['InitialMaxPrice'] = result.error
                            } else {
                                delete errors['InitialMaxPrice']
                            }
                        }}
                        suffix="₽"
                    />
                    {isEditable.initialMaxPrice &&
                        <FontAwesomeIcon icon={faPenToSquare} className={styles.icon}/>}
                </div>
            </div>
            {errors["InitialMaxPrice"] && <><span></span><span
                className='under-input-error'>{errors["InitialMaxPrice"]}</span></>}
            <label className={styles.label} htmlFor="Price">Наша цена:</label>
            <div className={styles.formGroup}>
                <div className={styles.inputRow}>
                    <CurrencyInput
                        name="Price"
                        id="Price"
                        value={tender.rebiddingPrices.length == 0 ? tender.price : tender.rebiddingPrices.at(-1)?.price}
                        className={styles.input}
                        disabled={!isEditable.price}
                        allowNegativeValue={false}
                        onValueChange={value => {
                            const result = tender.setPrice(value ? value : '')
                            if (!result.ok) {
                                errors['Price'] = result.error
                            } else {
                                delete errors['Price']
                            }
                        }}
                        suffix="₽"
                    />
                    {isEditable.price && <FontAwesomeIcon icon={faPenToSquare} className={styles.icon}/>}
                </div>
            </div>
            {errors["Price"] && <><span></span><span className='under-input-error'>{errors["Price"]}</span></>}
            {(tender.type != TenderType.Order && tender.type != TenderType.Offer) &&
                <>
                    <TableFormField propertyName="Date1_start" value={tender.date1_start}
                                    label="Дата начала 1-го этапа:"
                                    onChange={handleChange} isEditable={isEditable.date1_start} errors={errors}
                                    type="datetime-local"/>
                    <TableFormField propertyName="Date1_finish" value={tender.date1_finish}
                                    label="Дата окончания 1-го этапа:"
                                    onChange={handleChange} isEditable={isEditable.date1_finish} errors={errors}
                                    type="datetime-local"/>
                </>}
            <TableFormField propertyName="Date2_finish" value={tender.date2_finish}
                            label="Дата окончания 2-го этапа:"
                            onChange={handleChange} isEditable={isEditable.date2_finish} errors={errors}
                            type="datetime-local"/>
            <TableFormField propertyName="Date_finish" value={tender.date_finish} label="Подведение итогов:"
                            onChange={handleChange} isEditable={isEditable.date_finish} errors={errors}
                            type="datetime-local"/>
            <ContactPersonForm company={tender.company} contactPerson={tender.contactPerson} errors={errors}
                               isEditable={isEditable.contactPerson}/>
        </div>
    )
})

export default TenderForm