import ExcelTable, {DataType} from "@/models/Analytics/Table/Excel/ExcelTable";

export default class CompanyWinLooseAnalytics extends ExcelTable {
    override render() {
        this.renderHeaders()
        this.renderBody([DataType.String,
            DataType.Int, DataType.Float,
            DataType.Int, DataType.Float,
            DataType.Int, DataType.Float,
            DataType.Int, DataType.Float,
            DataType.Int, DataType.Float,
        ])
        return this.workbook
    }

    private renderHeaders() {
        const header_row_1 = this.headers[0].getCells();
        const header_row_2 = this.headers[1].getCells().map(value => value.title);
        const headers = [this.sheet.addRow([]), this.sheet.addRow([0, ...header_row_2])]
        headers.forEach((row, i) => {
            row.font = {bold: true, size: 14};
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFEFEFEF'},
            };
            row.border = this._getBorder('#DDDDDD');
            if (i == 0)
                row.height = 100;
            row.alignment = {vertical: "middle", horizontal: 'center', wrapText: true};
        })
        this.sheet.mergeCells('A1:A2');
        this.sheet.mergeCells('B1:C1');
        this.sheet.mergeCells('D1:E1');
        const a1 = this.sheet.getCell('A1');
        a1.value = header_row_1[0].title
        const b1 = this.sheet.getCell('B1');
        b1.value = header_row_1[1].title
        const d1 = this.sheet.getCell('D1');
        d1.value = header_row_1[2].title

        this.sheet.columns = [
            {width: 30},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
        ];
    }
}