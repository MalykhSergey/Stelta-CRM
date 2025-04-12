import TableRenderer from "@/models/Analytics/Table/TableRenderer";
import {JSX} from "react";

export default class JsxRenderer extends TableRenderer<JSX.Element> {
    render(): JSX.Element {
        return (
            <table>
                <thead>
                    {this.table.headers.map((header, rowIdx) => (
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
                    {this.table.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex}>{String(value)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
