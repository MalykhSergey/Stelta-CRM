import FileName from "./FileName";

export class DateRequest {
    constructor(
        public id: number,
        public date: string,
        public fileNames: FileName[] = []
    ) { }
}