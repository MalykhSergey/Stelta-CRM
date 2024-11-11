import tenderStorage from "../models/TenderStorage"
import SearchPage from "./ClientPage"

export default async function ServerPage() {
    const tenders = await tenderStorage.getAll()
    return (<SearchPage tendersJSON={JSON.stringify(tenders)} />)
}
