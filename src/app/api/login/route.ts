import {NextRequest} from "next/server";
import {login} from "@/models/User/UserService";

export async function POST(request: NextRequest) {
    const user = await request.json();
    return Response.json(await login(user.name, user.password))
}