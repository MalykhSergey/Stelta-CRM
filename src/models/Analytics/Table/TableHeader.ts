import HeaderCell from "@/models/Analytics/Table/HeaderCell";

export default class TableHeader {
    private cells: HeaderCell[] = [];

    constructor(initialCells?: HeaderCell[]) {
        if (initialCells) this.cells = initialCells;
    }

    addCell(cell: HeaderCell): void {
        this.cells.push(cell);
    }

    getCells(): HeaderCell[] {
        return this.cells;
    }
}