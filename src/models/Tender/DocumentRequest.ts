import FileName from "./FileName";

export class DocumentRequest {
    constructor(
        public id: number,
        public date: string,
        public fileNames: FileName[] = []
    ) {
    }

    setDate(date: string) {
        this.date = date
    }

    addFile(fileName: FileName) {
        this.fileNames.push(fileName)
    }

    removeFile(fileName: FileName) {
        const index = this.fileNames.findIndex(item => item.name === fileName.name);
        if (index > -1)
            this.fileNames.splice(index, 1);
    }

    serialize(simplify = false) {
        if (simplify){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {fileNames,...data} = this
            return data
        }
        else
            return this
    }
}