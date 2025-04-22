import {Metadata} from "next";
import styles from "@/app/search/page.module.css";
import TenderCard from "@/app/components/TenderCard/TenderCard";
import TendersSearch from "@/app/components/TendersSearch/TendersSearch";
import {search_tenders} from "@/models/Tender/TenderService";
import NavButtons from "@/app/components/TendersSearch/NavButtons";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Поиск',
}
export default async function ServerPage({searchParams,}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const status = parseInt((await searchParams).status as string) || null
    const name = (await searchParams).name || ''
    const company_name = (await searchParams).company_name || ''
    const reg_number = (await searchParams).reg_number || ''
    const start = (await searchParams).start || ''
    const end = (await searchParams).end || ''
    const page = (await searchParams).page || '0'
    console.log(status, name, reg_number, company_name, start, end, parseInt(page))
    const tenders = await search_tenders(status, name, reg_number, company_name, start, end, parseInt(page));
    return (
        <main className={styles.content + ' inherit'}>
            <div id={styles.leftPanel}>
                <TendersSearch/>
            </div>
            <div>
                <div className={styles.tenders}>
                    {tenders.map(tender => <TenderCard tender={tender} key={tender.id}/>)}
                </div>
                <NavButtons/>
            </div>
        </main>
    )
}