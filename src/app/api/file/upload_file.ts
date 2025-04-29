import tenderStorage from "@/models/Tender/TenderStorage";
import {authAction} from "@/models/User/UserService";
import fs from "fs";
import {Writable} from "node:stream";
import {mkdir, rm} from "node:fs/promises";
import FileName, {FileType} from "@/models/Tender/FileName";
import logger from "@/config/Logger";
import path from "path";
import TransactionManager from "@/models/TransactionManager";
import {Role} from "@/models/User/User";

export async function upload_file(request: Request) {
    const user = await authAction(async (user) => {
        if (user.role != Role.Editor && user.role != Role.Admin)
            return {error: "Запрещено редактирование"}
        return user
    })
    if ('error' in user)
        return new Response(user.error, {status: 401})
    const url = new URL(request.url)
    if (!request.body)
        return new Response('{"error":"Тело запроса пустое"}', {status: 403})
    let fileNameParam = url.searchParams.get('fileName');
    const tenderId = url.searchParams.get('tenderId')
    const stage = url.searchParams.get('stage') || ''
    const documentRequestId = url.searchParams.get('documentRequestId') || '';
    const rebiddingPriceId = url.searchParams.get('rebiddingPriceId') || '';
    let fileType = FileType.Tender
    let parentId = 0
    if (documentRequestId) {
        fileType = FileType.DocumentRequest
        parentId = Number.parseInt(documentRequestId)
    } else if (rebiddingPriceId) {
        fileType = FileType.RebiddingPrice
        parentId = Number.parseInt(rebiddingPriceId)
    }
    const reader = request.body.getReader();
    let writer
    if (fileNameParam && tenderId && (stage || parentId != 0)) {
        fileNameParam = decodeURIComponent(fileNameParam)
        const transaction = await TransactionManager.begin()
        const fileId = await tenderStorage.addFile(transaction, Number.parseInt(tenderId), fileNameParam, Number.parseInt(stage), documentRequestId, rebiddingPriceId)
        if (fileId?.error) {
            return new Response('{"error":"Ошибка на стороне сервера"}', {status: 503})
        }
        const newFile = new FileName(fileId, Number.parseInt(tenderId), parentId, fileNameParam, fileType);
        const folderPath = path.join(process.env.FILE_UPLOAD_PATH!, FileName.getFolderPath(newFile))
        const file_name = path.join(folderPath, fileNameParam).normalize();
        try {
            if (!file_name.startsWith(process.env.FILE_UPLOAD_PATH!)) {
                TransactionManager.roll_back(transaction)
                logger.info(`Попытка загрузить файл по пути: ${file_name}. Разрешено: ${process.env.FILE_UPLOAD_PATH!}`);
                return new Response('Доступ запрещён!', {status: 403});
            }
            logger.info(`${user.name} start upload file ${file_name}`);
            await mkdir(folderPath, {recursive: true})
            writer = Writable.toWeb(fs.createWriteStream(file_name, {autoClose: true})).getWriter();
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                await writer.ready;
                await writer.write(value);
            }
            await writer.close()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            TransactionManager.roll_back(transaction)
            if (writer) {
                writer.close()
                rm(folderPath,{recursive:true})
            }
            if (error.code == 'ECONNRESET'){
                logger.info(`${user.name} stop upload file ${file_name}`);
                return new Response('Загрузка прервана клиентом', {status: 200})
            }
            logger.error("Ошибка записи файла", error)
            return new Response('{"error":"Ошибка на стороне сервера"}', {status: 503})
        }
        TransactionManager.commit(transaction)
        logger.info(`${user.name} end upload file ${file_name}`);
        return new Response(JSON.stringify(newFile), {status: 200})
    }
    return new Response('{"error":"Отсутсвуют обязательные параметры!"}', {status: 403})
}
