import {loadUserNames} from "../../models/User/UserService";
import {UsersPage} from "./ClientPage";

export const dynamic = 'force-dynamic'
export default async function ServerPage() {
    return (
        <UsersPage userProps={await loadUserNames()}/>
    )
}