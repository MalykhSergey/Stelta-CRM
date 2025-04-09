import {NextRequest} from "next/server";
import {createContactPerson} from "@/models/Company/ContactPerson/ContactPersonService";

export async function POST(request: NextRequest) {
    const contactPerson = await request.json();
    const companyId = request.nextUrl.searchParams.get('companyId') || '';
    return Response.json(await createContactPerson(contactPerson, parseInt(companyId)));
}