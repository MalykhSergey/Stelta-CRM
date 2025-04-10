import {NextRequest} from "next/server";
import {updateTenderById} from "@/models/Tender/TenderService";

export async function POST(request: NextRequest) {
    const tender = await request.json();
    const result = await updateTenderById(tender);
    // if error
    if (result)
        return Response.json(result);
    return Response.json("");
}