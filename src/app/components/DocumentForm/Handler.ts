"use server";
import tenderStorage from '@/app/models/TenderStorage';
import fs from 'fs/promises';
export async function uploadHandler(formData: FormData) {
    const files = formData.getAll('file') as File[]
    const tenderId = formData.get('tenderId')?.toString()
    const stage = formData.get('stage')?.toString()
    if (tenderId && stage) {
        await fs.mkdir(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${stage}`, { recursive: true })
        for (const file of files) {
            const file_name = decodeURI(file.name)
            await tenderStorage.addFile(Number.parseInt(tenderId), file_name, Number.parseInt(stage))
            await fs.writeFile(`${process.env.FILE_UPLOAD_PATH}/${tenderId}/${stage}/${file_name}`, Buffer.from(await file.arrayBuffer()));
        }
    }
}
export async function deleteHandler(fileId: number) {
    await tenderStorage.deleteFile(fileId)
}