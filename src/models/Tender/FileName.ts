export default class FileName {
    constructor(
        public id: number,
        public tenderId: number,
        public parentId: number,
        public name: string,
        public fileType: FileType
    ) { }
    static getFilePath(fileName: FileName) {
        return `${FileName.getFolderPath(fileName)}/${fileName.name}`
    }
    static getFolderPath(fileName: FileName) {
        if (fileName.fileType === FileType.Tender)
            return `${fileName.tenderId}/${fileName.fileType}/${fileName.id}`
        else
            return `${fileName.tenderId}/${fileName.fileType}/${fileName.parentId}/${fileName.id}`
    }
}

export enum FileType {
    Tender,
    DocumentRequest,
    RebiddingPrice,
}