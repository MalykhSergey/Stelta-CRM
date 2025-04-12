export default class HeaderCell {
    constructor(
        public readonly title: string,
        public readonly colSpan: number = 1,
        public readonly rowSpan: number = 1,
    ) {}
}