import tenderStorage from "../models/TenderStorage"
import SearchPage from "./ClientPage"

export const dynamic = 'force-dynamic'
export default async function ServerPage() {
    const tenders = await tenderStorage.getAll()
    return (<SearchPage tendersJSON={JSON.stringify(tenders)}/>)
}
