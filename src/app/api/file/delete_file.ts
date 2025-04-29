import {NextRequest} from "next/server";
import FileName from "@/models/Tender/FileName";
import {authAction} from "@/models/User/UserService";
import {User} from "@/models/User/User";
import TransactionManager from "@/models/TransactionManager";
import tenderStorage from "@/models/Tender/TenderStorage";
import fs from "fs/promises";
import logger from "@/config/Logger";
import {handleDatabaseError} from "@/config/Database";

export async function delete_file(request: NextRequest) {
    const fileName = JSON.parse(request.nextUrl.searchParams.get('fileName') || '')
    if (FileName.checkObject(fileName)) {
        const result = await authAction(async (user: User) => {
            const transaction = await TransactionManager.begin()
            try {
                await tenderStorage.deleteFile(transaction, fileName)
                await fs.rm(`${process.env.FILE_UPLOAD_PATH}/${FileName.getFolderPath(fileName)}`, {recursive: true})
                TransactionManager.commit(transaction)
                logger.info(`${user.name} delete file ${FileName.getFilePath(fileName)}`);
            } catch (e) {
                TransactionManager.roll_back(transaction)
                return handleDatabaseError(e, {}, 'Ошибка удаления файла!');
            }
        })
        if (result)
            return Response.json(result)
    } else return new Response('{"error":"Неправильный формат fileName"}', {status: 403});
    return Response.json('');
}