import {JSX} from "react";
import Table from "@/models/Analytics/Table/Table";

export default class JsxTable extends Table<JSX.Element> {
    override render(): JSX.Element {
        return (
            <div className="table-container">
                <table id={"my-table"}>
                    {this.colSizes.length > 0 &&
                        <colgroup>
                            {this.colSizes.map((size, idx) => <col key={idx}
                                                                         style={{width: Math.round(size * 100) + "%"}}/>)}
                        </colgroup>
                    }
                    <thead>
                    {this.headers.map((header, rowIdx) => (
                        <tr key={rowIdx}>
                            {header.getCells().map((cell, cellIdx) => (
                                <th
                                    key={cellIdx}
                                    colSpan={cell.colSpan}
                                    rowSpan={cell.rowSpan}
                                >
                                    {cell.title}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {this.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
