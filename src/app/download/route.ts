import logger from "@/config/Logger";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get('fileName')
    const filePath = `${process.env.FILE_UPLOAD_PATH}/${fileName}`
    try {
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
