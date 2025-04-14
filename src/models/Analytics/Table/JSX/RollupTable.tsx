import JsxTable from "@/models/Analytics/Table/JSX/JsxTable";
import React from "react";

export default class RollupTable extends JsxTable{
    render(): React.JSX.Element {
        return <div className={'rollup'}>{super.render()}</div>
    }
}