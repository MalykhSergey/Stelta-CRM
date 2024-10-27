"use server";
import tenderStorage from '@/app/models/TenderStorage';
import fs from 'fs/promises';
export async function uploadHandler(formData: FormData) {
    const files = formData.getAll('file') as File[]
    const tenderId = formData.get('tenderId')?.toString()
    if (tenderId)
        for (const file of files) {
            const file_name = decodeURI(file.name)
            await fs.writeFile(`${process.env.FILE_UPLOAD_PATH}/${file_name}`, Buffer.from(await file.arrayBuffer()));
            await tenderStorage.addFile(Number.parseInt(tenderId), file_name)
        }
}
export async function deleteHandler(fileId: number) {
    await tenderStorage.deleteFile(fileId)
}