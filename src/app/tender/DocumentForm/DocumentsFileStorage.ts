import FileName from "@/models/Tender/FileName";
import {makeAutoObservable, runInAction} from "mobx";
import {showMessage} from "@/app/components/Alerts/Alert";
import RequestExecutor from "@/app/components/RequestExecutor/RequestExecutor";


export default class DocumentsFileStorage {
    private readonly _source_ref: FileName[] = []

    constructor(fileNames: FileName[]) {
        this._source_ref = fileNames
        makeAutoObservable(this)
    }

    private _uploading_files: { file_name: FileName, progress: number, request: XMLHttpRequest }[] = []

    get uploading_files(): { file_name: FileName; progress: number; request: XMLHttpRequest }[] {
        return this._uploading_files;
    }

    get files(): FileName[] {
        return this._source_ref;
    }

    add_file(encodedFileName: string, tenderId: number, specialPlaceName: string, specialPlaceId: number, data: File) {
        const file_name = new FileName(0, tenderId, specialPlaceId, data.name, FileName.defineFileType(specialPlaceName))
        const url = `/api/file?fileName=${encodedFileName}&tenderId=${file_name.tenderId}&${specialPlaceName}=${specialPlaceId}`
        const xhr = new XMLHttpRequest();
        const uploading_file = makeAutoObservable({file_name: file_name, progress: 0, request: xhr});
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                runInAction(() => uploading_file.progress = Math.round(100 * event.loaded / event.total))
            }
        });
        xhr.addEventListener("error", () => {
            showMessage("Ошибка подключения!");
            const index = this.uploading_files.findIndex(item => FileName.compare(item.file_name, file_name));
            if (index > -1)
                this.uploading_files.splice(index, 1)
        });
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", data.type || "application/octet-stream");
        xhr.addEventListener("load", () => {
            try {
                const result = JSON.parse(xhr.responseText)
                if (result?.error) {
                    showMessage(result.error)
                    return
                }
                file_name.id = result.id
                this.move_file_to_source(file_name)
            } catch {
                showMessage('Произошла техническая ошибка загрузки. Попробуйте обновить страницу')
                const index = this.uploading_files.findIndex(item => FileName.compare(item.file_name, file_name));
                if (index > -1)
                    this.uploading_files.splice(index, 1)
            }
        });
        xhr.send(data);
        this._uploading_files.push(uploading_file)
    }

    async remove_file(file_name: FileName) {
        console.log(file_name)
        const encodedFileName = encodeURIComponent(JSON.stringify(file_name))
        const delete_executor = new RequestExecutor<void>(`/api/file?fileName=${encodedFileName}`,{method:'DELETE'},()=>{
            const index = this._source_ref.findIndex(item => FileName.compare(item, file_name));
            if (index > -1)
                this._source_ref.splice(index, 1)
        })
        await delete_executor.execute();
    }

    cancel_uploading(uploading_file: { file_name: FileName, progress: number, request: XMLHttpRequest }) {
        uploading_file.request.abort()
        const index = this.uploading_files.findIndex(item => FileName.compare(item.file_name, uploading_file.file_name));
        this._uploading_files.splice(index, 1);
    }

    private move_file_to_source(file_name: FileName) {
        const index = this.uploading_files.findIndex(item => FileName.compare(item.file_name, file_name));
        if (index > -1) {
            this.uploading_files.splice(index, 1)
            this._source_ref.push(file_name)
        }
    }
}