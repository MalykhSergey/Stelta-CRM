import { loadUsers } from "../../models/User/UserService";
import { ConfirmDialogProvider } from "../components/Dialog/ConfirmDialogContext";
import { UsersPage } from "./ClientPage";

export const dynamic = 'force-dynamic'
export default async function ServerPage() {
    return (
        <ConfirmDialogProvider>
            <UsersPage userProps={await loadUsers()} />
        </ConfirmDialogProvider>
    )
}