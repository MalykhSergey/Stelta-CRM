import HeaderCell from "@/models/Analytics/Table/HeaderCell";

export default class TableHeader {
    private cells: HeaderCell[] = [];

    constructor(initialCells?: HeaderCell[]) {
        if (initialCells) this.cells = initialCells;
    }

    getCells(): HeaderCell[] {
        return this.cells;
    }
}