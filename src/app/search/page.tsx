import tenderStorage from "../../models/Tender/TenderStorage"
import SearchPage from "./ClientPage"
import {Metadata} from "next";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Поиск',
}
export default async function ServerPage() {
    const tenders = await tenderStorage.getAll()
    return (<SearchPage tendersJSON={JSON.stringify(tenders)}/>)
}
