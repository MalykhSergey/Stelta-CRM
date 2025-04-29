import TenderCard from "@/app/components/TenderCard/TenderCard";
import NavButtons from "@/app/components/TendersSearch/NavButtons";
import TendersSearch from "@/app/components/TendersSearch/TendersSearch";
import styles from "@/app/search/page.module.css";
import { search_tenders } from "@/models/Tender/TenderService";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Поиск',
}
export default async function ServerPage({ searchParams, }: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const status = parseInt((await searchParams).status as string) || null
    const type = parseInt((await searchParams).type as string) || null
    const funding_type = parseInt((await searchParams).funding_type as string) || null
    const name = (await searchParams).name || ''
    const company_name = (await searchParams).company_name || ''
    const reg_number = (await searchParams).reg_number || ''
    let start = (await searchParams).start || ''
    let end = (await searchParams).end || ''
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        start = end = ''
    }
    const page = (await searchParams).page || '0'
    const { remained, tenders } = await search_tenders(status, type, funding_type, name, reg_number, company_name, start, end, parseInt(page));
    return (
        <main className={styles.content + ' inherit'}>
            <div id={styles.leftPanel}>
                <TendersSearch/>
            </div>
            <div className={styles.container}>
                <div className={styles.tenders}>
                    {tenders.map(tender => <TenderCard tender={tender} key={tender.id} />)}
                </div>
                <NavButtons remained={remained} />
            </div>
        </main>
    )
}