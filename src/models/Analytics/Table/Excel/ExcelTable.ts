import ExcelJS from 'exceljs';

import Workbook from "exceljs/index";
import Table from "@/models/Analytics/Table/Table";
import TableHeader from "@/models/Analytics/Table/TableHeader";

export enum DataType {
    String,
    Int,
    Float
}

export default abstract class ExcelTable extends Table<Workbook> {

    workbook = new ExcelJS.Workbook();
    sheet = this.workbook.addWorksheet('Таблица');

    constructor(
        headers: TableHeader[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Record<string, any>[],
        colSizes: number[] = [],
    ) {
        super(headers, data, colSizes)
    }

    override render(): Workbook {
        this.renderBody([])
        return this.workbook;
    }

    renderBody(column_types: DataType[]) {
        this.data.forEach((dataRow, rowIdx) => {
            const values = Object.values(dataRow)
            const row = this.sheet.addRow(values);
            const isLast = rowIdx === this.data.length - 1;
            row.eachCell((cell, i) => {
                if (column_types[i - 1] == DataType.Int) {
                    cell.value = parseInt(cell.value as string);
                } else if (column_types[i - 1] == DataType.Float) {
                    cell.value = parseFloat(cell.value as string);
                    cell.numFmt = cell.numFmt = '#,##0.00 ₽'
                }
                cell.border = this._getBorder('#EEEEEE');
                cell.alignment = {horizontal: 'right'};
                if (isLast) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'FFE3E3E3'},
                    };
                    cell.font = {bold: true, size: 14};
                } else if (rowIdx % 2 === 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'FFF7F7F7'},
                    };
                }

                cell.font ??= {size: 14};
            });
        });
    }

    protected _getBorder(color: string): ExcelJS.Borders {
        const argb = 'FF' + color.replace('#', '').toUpperCase();
        return {
            top: {style: 'thin', color: {argb}},
            left: {style: 'thin', color: {argb}},
            bottom: {style: 'thin', color: {argb}},
            right: {style: 'thin', color: {argb}},
            diagonal: {}
        };
    }
}
