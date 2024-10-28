"use server";
import FileName from '@/app/models/FileName';
import tenderStorage from '@/app/models/TenderStorage';
import fs from 'fs/promises';
export async function uploadHandler(formData: FormData) {
    const files = formData.getAll('file') as File[]
    const tenderId = formData.get('tenderId')?.toString()
    const stage = formData.get('stage')?.toString()
    const dateRequestId = formData.get('dateRequestId')?.toString()
    const rebiddingPriceId = formData.get('rebiddingPriceId')?.toString()
    const fileNames = []
    if (tenderId && stage) {
        let folderPath = `${process.env.FILE_UPLOAD_PATH}/${tenderId}/${stage}`
        if (rebiddingPriceId)
            folderPath += `/rebiddingPrices/${rebiddingPriceId}`
        else if (dateRequestId)
            folderPath += `/datesRequests/${dateRequestId}`
        await fs.mkdir(folderPath, { recursive: true })
        for (const file of files) {
            const fileName = decodeURI(file.name)
            await fs.writeFile(`${folderPath}/${fileName}`, Buffer.from(await file.arrayBuffer()));
            const file_id = await tenderStorage.addFile(Number.parseInt(tenderId), fileName, Number.parseInt(stage), dateRequestId, rebiddingPriceId)
            fileNames.push(new FileName(file_id, fileName))
        }
    }
    return JSON.stringify(fileNames)
}
export async function deleteHandler(fileId: number) {
    await tenderStorage.deleteFile(fileId)
}