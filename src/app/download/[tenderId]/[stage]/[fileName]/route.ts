import fs from "fs/promises";
type GetParams = {
    params: {
        tenderId: string;
        stage: string;
        fileName: string;
    };
};
export async function GET(req: Request, { params }: GetParams) {
    console.log(params)
    const filePath = `${process.env.FILE_UPLOAD_PATH}/${params.tenderId}/${params.stage}/${params.fileName}`
    console.log(filePath)
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
