import ExcelTable, {DataType} from "@/models/Analytics/Table/Excel/ExcelTable";

export default class OrdersAnalytics extends ExcelTable {
    override render() {
        this.renderHeaders()
        this.renderBody([
            DataType.String,
            DataType.String,
            DataType.String,
            DataType.Float,
        ])
        const rows = this.sheet.getRows(this.data.length - 1, 3);
        if (rows)
            rows.forEach((row) => {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {argb: 'FFE3E3E3'}
                    }
                    cell.font = {bold: true, size: 14}
                })
            })
        return this.workbook
    }

    private renderHeaders() {
        const header_row_1 = this.headers[0].getCells().map(value => value.title);
        const headers = [this.sheet.addRow(header_row_1)]
        this.drawHeaders(headers)
        this.sheet.columns = [
            {width: 50},
            {width: 100},
            {width: 25},
            {width: 30},
        ];
        this.sheet.getColumn('D').alignment = {horizontal: 'center', vertical: 'middle'};
    }
}