import { delete_file } from "@/app/api/file/delete_file";
import { download_file } from "@/app/api/file/download_file";
import { upload_file } from "@/app/api/file/upload_file";

export const config = {api: {bodyParser: false}}
export const GET = download_file;
export const POST = upload_file;
export const DELETE = delete_file;