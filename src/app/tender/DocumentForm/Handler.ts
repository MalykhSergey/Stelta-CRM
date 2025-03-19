"use server";
import {handleDatabaseError} from '@/config/Database';
import logger from '@/config/Logger';
import FileName from '@/models/Tender/FileName';
import tenderStorage from '@/models/Tender/TenderStorage';
import {User} from '@/models/User/User';
import {authAction} from "@/models/User/UserService";
import fs from 'fs/promises';
import TransactionManager from "@/models/TransactionManager";

export async function deleteHandler(fileName: FileName) {
    return authAction(async (user: User) => {
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
}