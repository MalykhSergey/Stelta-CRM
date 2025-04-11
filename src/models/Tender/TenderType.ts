export enum TenderType {
    Tender = 0,
    Special = 1,
    Order = 2,
    Offer = 3
}

export function getTenderTypeName(tenderType: TenderType): string {
    switch (tenderType){
        case TenderType.Tender:
            return "Тендер"
        case TenderType.Special:
            return "Тендер - подыгрыш"
        case TenderType.Order:
            return "Заказ"
        case TenderType.Offer:
            return "Коммерческое предложение"
    }
}