import fs from "fs/promises";
type GetParams = {
    params: {
        fileName: string;
    };
};
export async function GET(req: Request, { params }: GetParams) {
    const filePath = `${process.env.FILE_UPLOAD_PATH}/${params.fileName}`
    try {
        await fs.access(filePath)
        const file = await fs.readFile(filePath)
        return new Response(file)
    }
    catch {
        return new Response(
            `Файл ${params.fileName} не найден!`, {
            status: 404
        }
        )
    }
}
