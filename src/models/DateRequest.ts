import FileName from "./FileName";

export class DateRequest {
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
}