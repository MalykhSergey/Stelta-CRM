import tenderStorage from "@/app/models/TenderStorage";
import { redirect } from "next/navigation";

export async function GET() {
    const tenderId = await tenderStorage.create()
    redirect(`/tender/${tenderId}`)
}
