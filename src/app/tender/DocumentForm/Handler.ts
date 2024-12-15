"use server";
import FileName from '@/models/Tender/FileName';
import tenderStorage from '@/models/Tender/TenderStorage';
import fs from 'fs/promises';
import {authAction} from "@/models/User/UserService";

export async function uploadHandler(formData: FormData) {
    return authAction(async () => {
        const files = formData.getAll('file') as File[]
        const tenderId = formData.get('tenderId')?.toString()
        const stage = formData.get('stage')?.toString()
        const dateRequestId = formData.get('dateRequestId')?.toString()
        const rebiddingPriceId = formData.get('rebiddingPriceId')?.toString()
        const fileNames = []
        if (tenderId && stage) {
            for (const file of files) {
                const fileName = decodeURI(file.name)
                const fileId = await tenderStorage.addFile(Number.parseInt(tenderId), fileName, Number.parseInt(stage), dateRequestId, rebiddingPriceId)
                const folderPath = `${process.env.FILE_UPLOAD_PATH}/${tenderId}/${fileId}`
                await fs.mkdir(folderPath, {recursive: true})
                await fs.writeFile(`${folderPath}/${fileName}`, Buffer.from(await file.arrayBuffer()));
                fileNames.push({...new FileName(fileId, fileName)})
            }
        }
        return fileNames
    })
}

export async function deleteHandler(tenderId: number, fileId: number) {
    return authAction(async ()=>{
        await tenderStorage.deleteFile(fileId)
        await fs.rm(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${fileId}`, {recursive: true})
    })
}