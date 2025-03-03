export default class FileName {
    constructor(
        public id: number,
        public tenderId: number,
        public parentId: number,
        public name: string,
        public fileType: FileType
    ) {
    }

    static defineFileType(parentName: string): FileType {
        switch (parentName) {
            case 'rebiddingPriceId':
                return FileType.RebiddingPrice
            case 'documentRequestId':
                return FileType.DocumentRequest
        }
        return FileType.Tender
    }

    static getFilePath(fileName: FileName) {
        return `${FileName.getFolderPath(fileName)}/${fileName.name}`
    }

    static getFolderPath(fileName: FileName) {
        if (fileName.fileType === FileType.Tender)
            return `${fileName.tenderId}/${fileName.fileType}/${fileName.id}`
        else
            return `${fileName.tenderId}/${fileName.fileType}/${fileName.parentId}/${fileName.id}`
    }

    static compare(a: FileName, b: FileName): boolean {
        if (a.id != b.id) return false;
        if (a.tenderId != b.tenderId) return false;
        if (a.parentId != b.parentId) return false;
        if (a.name != b.name) return false;
        return a.fileType == b.fileType;
    }
}

export enum FileType {
    Tender,
    DocumentRequest,
    RebiddingPrice,
}