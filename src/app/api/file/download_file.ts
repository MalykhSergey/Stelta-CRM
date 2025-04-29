import logger from "@/config/Logger";
import {NextRequest} from "next/server";
import path from "path";
import {access} from "node:fs/promises";
import fs from "fs/promises";
import {Readable} from "node:stream";
import {authorize} from "@/models/User/UserService";

export async function download_file(request: NextRequest) {
    if (!(await authorize())) {
        return new Response('Доступ запрещён!', {status: 403});
    }
    const searchParams = request.nextUrl.searchParams
    let fileName = searchParams.get('fileName')
    if (!fileName)
        return new Response('Имя файла не указано!', {status: 400});
    fileName = decodeURIComponent(fileName)
    try {
        const baseDirectory = process.env.FILE_UPLOAD_PATH!;
        const filePath = path.join(baseDirectory, fileName).normalize();
        if (!filePath.startsWith(baseDirectory)) {
            logger.info(`Попытка скачать файл по пути: ${filePath}. Разрешено: ${baseDirectory}`);
            return new Response('Доступ запрещён!', {status: 403});
        }
        await access(filePath)
        const file = Readable.toWeb((await fs.open(filePath)).createReadStream({autoClose: true})) as ReadableStream
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Response(file, {
            headers: {'Content-Disposition': `attachment; filename="${encodeURIComponent(path.basename(filePath))}"`}
        })
    } catch (e) {
        logger.error("Ошибка скачивания файла", e)
        return new Response(`Файл не найден!`, {status: 404})
    }
}
