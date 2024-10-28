import FileName from "./FileName";

export class RebiddingPrice {
    constructor(
        public id: number,
        public price: number,
        public fileNames: FileName[]
    ) { }
}