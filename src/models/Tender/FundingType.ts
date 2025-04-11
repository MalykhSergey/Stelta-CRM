export enum FundingType {
    Low = 0,
    High = 1,
    Budget = 2
}

export function getFundingTypeName(fundingType: FundingType) {
    switch (fundingType) {
        case FundingType.Low:
            return "Тендер с низкой вероятностью"
        case FundingType.High:
            return "Тендер с высокой вероятностью"
        case FundingType.Budget:
            return "Бюджет"
        default:
            return "Ошибка!"
    }
}