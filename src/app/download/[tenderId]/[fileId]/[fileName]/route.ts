import fs from "fs/promises";
type GetParams = {
    params: {
        tenderId: string;
        fileId: string;
        fileName: string;
    };
};
export async function GET(req: Request, { params }: GetParams) {
    const filePath = `${process.env.FILE_UPLOAD_PATH}/${params.tenderId}/${params.fileId}/${params.fileName}`
    try {
        await fs.access(filePath)
        const file = await fs.readFile(filePath)
        return new Response(file)
    }
    catch {
        return new Response(
            `Файл не найден!`, {
            status: 404
        }
        )
    }
}
