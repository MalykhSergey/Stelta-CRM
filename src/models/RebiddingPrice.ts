import {Result} from "../app/Result";
import FileName from "./FileName";

export class RebiddingPrice {
    setPrice(value: string): Result<string, string> {
        this.price = value
        if (value == "") {
            return {ok: false, error: 'Поле не должно быть пустым!'}
        }
        return {ok: true, value: ''}
    }

    addFile(fileName: FileName) {
        this.fileNames.push(new FileName(0, fileName.name))
    }

    removeFile(fileName: FileName) {
        const index = this.fileNames.findIndex(item => item.name === fileName.name);
        if (index > -1)
            this.fileNames.splice(index, 1);
    }

    constructor(
        public id: number,
        public price: string,
        public fileNames: FileName[]
    ) {
    }
}