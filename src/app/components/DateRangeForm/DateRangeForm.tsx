"use client"
import styles from "./DateRangeForm.module.css";
import {PrimaryButton} from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import getParamsDates from "@/app/components/DateRangeForm/GetParamsDates";

export default function DateRangeForm() {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const {startDate, endDate} = getParamsDates(searchParams.get('start') || '', searchParams.get('end') || '');
    const formHandler = (form: FormData) => {
        const params = {
            start: form.get('start') as string || '',
            end: form.get('end') as string || ''
        }
        router.push(pathname + '?' + new URLSearchParams(params))
    }
    // console.log(startDate)
    // console.log(endDate)
    return (<form id={styles.inputsContainer} className='card' action={formHandler}>
        <div className="row-inputs">
            <label htmlFor="start">От:</label>
            <input id='start' name='start' type="date" defaultValue={startDate.toISOString().slice(0, 10)}/>
        </div>
        <div className="row-inputs">
            <label htmlFor="start">До:</label>
            <input id='end' name='end' type="date" defaultValue={endDate.toISOString().slice(0, 10)}/>
        </div>
        <PrimaryButton id={styles.sendButton}>Рассчитать</PrimaryButton>
    </form>)
}