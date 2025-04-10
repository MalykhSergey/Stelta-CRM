import {logout} from "@/models/User/UserService";

export async function GET() {
    await logout();
}