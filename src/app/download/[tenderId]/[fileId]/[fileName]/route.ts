import fs from "fs/promises";

type GetParams = {
    params: Promise<{
        tenderId: string;
        fileId: string;
        fileName: string;
    }>;
};

export async function GET(req: Request, props: GetParams) {
    const params = await props.params;
    const filePath = `${process.env.FILE_UPLOAD_PATH}/${params.tenderId}/${params.fileId}/${params.fileName}`
    try {
        await fs.access(filePath)
        const file = await fs.readFile(filePath)
        return new Response(file)
    } catch {
        return new Response(
            `Файл не найден!`, {
                status: 404
            }
        )
    }
}
