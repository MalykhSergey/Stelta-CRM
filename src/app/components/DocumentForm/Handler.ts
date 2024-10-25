"use server";
import tenderStorage from '@/app/models/TenderStorage';
import fs from 'fs/promises';
export default async function uploadHadler(formData: FormData) {
    let file = formData.get('file') as File
    await fs.writeFile(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, Buffer.from(await file.arrayBuffer()));
    tenderStorage.getById(Number.parseInt(formData.get('tenderId') + "")).fileNames.push(file.name)
}