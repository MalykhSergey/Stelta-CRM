function getStatusName(status: number) {
    switch (status) {
        case -4:
            return "Проиграли"
        case 0:
            return "Новый тендер"
        case 1:
            return "Подготовка заявки 1 Этап"
        case 2:
            return "Заявка подана 1 этап"
        case 3:
            return "Подготовка заявки 2 Этап"
        case 4:
            return "Заявка подана 2 этап"
        case 5:
            return "Заключение договора"
        case 6:
            return "Договор заключен"
        default:
            return "Не участвуем"
    }
}

export default getStatusName