import {HomePageClient} from './HomePageClient';
import tenderStorage from '../models/Tender/TenderStorage';

export const dynamic = 'force-dynamic'
export default async function HomePageServer() {
    const tenders = await tenderStorage.getAll()
    return (<HomePageClient tendersJSON={JSON.stringify(tenders)}/>)
}
