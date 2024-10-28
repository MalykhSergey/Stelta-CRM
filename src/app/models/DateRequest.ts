import FileName from "./FileName";

export class DateRequest {
    constructor(
        public id: number,
        public date: string,
        public fileNames: FileName[] = []
    ) { }
    addFile(fileName: FileName) {
        this.fileNames.push(new FileName(0, fileName.name))
    }
    removeFile(fileName: FileName) {
        const index = this.fileNames.findIndex(item => item.name === fileName.name);
        if (index > -1)
            this.fileNames.splice(index, 1);
    }
}