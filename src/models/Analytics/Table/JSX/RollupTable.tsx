import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import React from "react";
import TableHeader from "@/models/Analytics/Table/TableHeader";

export default class RollupTable extends JsxTable {
    constructor(
        headers: TableHeader[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Record<string, any>[],
        colSizes: number[] = [],
        private readonly summary_rows = 1
    ) {
        super(headers, data, colSizes)
    }

    render(): React.JSX.Element {
        return <div className={`rollup-${this.summary_rows}`}>{super.render()}</div>
    }
}