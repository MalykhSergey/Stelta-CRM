import Table from "@/models/Analytics/Table/Table";

export default abstract class TableRenderer<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(readonly table: Table) {};

    abstract render(): T;
}