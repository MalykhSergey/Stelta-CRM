import logger from "@/config/Logger";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    let fileName = searchParams.get('fileName')
    if (!fileName) {
        return new Response('Имя файла не указано!', { status: 400 });
    }
    fileName = decodeURIComponent(fileName)
    const baseDirectory = process.env.FILE_UPLOAD_PATH || '/var/www/stelta-crm/uploads';
    const filePath = path.join(baseDirectory, fileName);
    try {
        if (!filePath.startsWith(path.resolve(baseDirectory))) {
            logger.info(`Попытка скачать файл по пути: ${filePath}. Разрешено: ${baseDirectory}`);
            return new Response('Доступ запрещён!', { status: 403 });
        }
        await fs.access(filePath)
        const file = await fs.readFile(filePath)
        return new Response(file, {
            headers: {
                'Content-Disposition': `attachment; filename="${encodeURIComponent(path.basename(filePath))}"`,
            },
        })
    } catch (e) {
        logger.error(e)
        return new Response(
            `Файл не найден!`, {
            status: 404
        }
        )
    }
}
