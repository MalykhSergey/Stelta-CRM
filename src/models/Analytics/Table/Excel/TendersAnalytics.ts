import ExcelTable, {DataType} from "@/models/Analytics/Table/Excel/ExcelTable";

export default class TendersAnalytics extends ExcelTable {
    override render() {
        this.renderHeaders()
        this.renderBody([
            DataType.String,
            DataType.String,
            DataType.Float,
            DataType.String,
            DataType.String,
        ])
        return this.workbook
    }

    private renderHeaders() {
        const header_row_1 = this.headers[0].getCells().map(value => value.title);
        const headers = [this.sheet.addRow(header_row_1)]
        this.drawHeaders(headers)
        this.sheet.columns = [
            {width: 50},
            {width: 100},
            {width: 20},
            {width: 20},
            {width: 40},
        ];
    }
}