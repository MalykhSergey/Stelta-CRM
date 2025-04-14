import TableHeader from "@/models/Analytics/Table/TableHeader";

export default abstract class Table<T> {
    constructor(
        readonly headers: TableHeader[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly data: Record<string, any>[],
        readonly colSizes: number[] = [],
    ) {
    }
    abstract render(): T;
}
