import {NextRequest} from "next/server";
import {download_file} from "@/app/api/file/download_file";
import {upload_file} from "@/app/api/file/upload_file";
import {delete_file} from "@/app/api/file/delete_file";

export const config = {api: {bodyParser: false}}

export async function GET(request: NextRequest) {
    return download_file(request)
}

export async function POST(request: Request) {
    return upload_file(request)
}

export async function DELETE(request: NextRequest) {
    return delete_file(request);
}