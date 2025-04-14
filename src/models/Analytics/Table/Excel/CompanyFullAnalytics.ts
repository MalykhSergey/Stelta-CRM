import ExcelTable, {DataType} from "@/models/Analytics/Table/Excel/ExcelTable";

export default class CompanyFullAnalytics extends ExcelTable {
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
        this.sheet.mergeCells('F1:G1');
        this.sheet.mergeCells('H1:I1');
        this.sheet.mergeCells('J1:J2');
        this.sheet.mergeCells('K1:K2');
        const a1 = this.sheet.getCell('A1');
        a1.value = header_row_1[0].title
        const b1 = this.sheet.getCell('B1');
        b1.value = header_row_1[1].title
        const d1 = this.sheet.getCell('D1');
        d1.value = header_row_1[2].title
        const f1 = this.sheet.getCell('F1');
        f1.value = header_row_1[3].title
        const h1 = this.sheet.getCell('H1');
        h1.value = header_row_1[4].title
        const j1 = this.sheet.getCell('J1');
        j1.value = header_row_1[5].title
        const k1 = this.sheet.getCell('K1');
        k1.value = header_row_1[6].title

        this.sheet.columns = [
            {width: 30},
            {width: 20,},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
            {width: 20},
        ];
    }
}