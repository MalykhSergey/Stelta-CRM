import TableHeader from "@/models/Analytics/Table/TableHeader";

export default class Table {
    constructor(
        readonly headers: TableHeader[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly data: Record<string, any>[],
    ) {
    }
}
