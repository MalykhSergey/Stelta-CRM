"use server";
import { handleDatabaseError } from '@/config/Database';
import FileName, { FileType } from '@/models/Tender/FileName';
import tenderStorage from '@/models/Tender/TenderStorage';
import { authAction } from "@/models/User/UserService";
import fs from 'fs/promises';

export async function uploadHandler(formData: FormData) {
    return authAction(async () => {
        const files = formData.getAll('file') as File[]
        const tenderId = formData.get('tenderId')?.toString()
        const stage = formData.get('stage')?.toString()
        const rebiddingPriceId = formData.get('rebiddingPriceId')?.toString()
        const documentRequestId = formData.get('documentRequestId')?.toString()
        let fileType = FileType.Tender
        let parentId = 0
        if (documentRequestId) {
            fileType = FileType.DocumentRequest
            parentId = Number.parseInt(documentRequestId)
        }
        else if (rebiddingPriceId) {
            fileType = FileType.RebiddingPrice
            parentId = Number.parseInt(rebiddingPriceId)
        }
        const fileNames = []
        if (tenderId && stage) {
            for (const file of files) {
                const fileName = decodeURI(file.name)
                const fileId = await tenderStorage.addFile(Number.parseInt(tenderId), fileName, Number.parseInt(stage), documentRequestId, rebiddingPriceId)
                const newFile = new FileName(fileId, Number.parseInt(tenderId), parentId, fileName, fileType);
                const folderPath = `${process.env.FILE_UPLOAD_PATH}/${FileName.getFolderPath(newFile)}`
                await fs.mkdir(folderPath, { recursive: true })
                await fs.writeFile(`${folderPath}/${fileName}`, Buffer.from(await file.arrayBuffer()));
                fileNames.push({ ...newFile })
            }
        }
        return fileNames
    })
}

export async function deleteHandler(fileName: FileName) {
    return authAction(async () => {
        try {
            await tenderStorage.deleteFile(fileName)
            await fs.rm(`${process.env.FILE_UPLOAD_PATH}/${FileName.getFolderPath(fileName)}`, { recursive: true })
        } catch (e) {
            return handleDatabaseError(e, {}, 'Ошибка удаления файла!');
        }
    })
}