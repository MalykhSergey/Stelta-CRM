import {HomePageClient} from './HomePageClient';
import tenderStorage from '../models/Tender/TenderStorage';
import {Metadata} from "next";

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Торги',
}
export default async function HomePageServer() {
    const tenders = await tenderStorage.getAll()
    return (<HomePageClient tendersJSON={JSON.stringify(tenders)}/>)
}
