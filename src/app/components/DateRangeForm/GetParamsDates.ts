export default function getParamsDates(start_param: string, end_param: string) {
    const currentYear = new Date().getFullYear();
    let startDate = new Date(currentYear, 0, 1);
    let endDate = new Date(currentYear, 11, 31);
    if (start_param && end_param) {
        startDate = new Date(start_param)
        endDate = new Date(end_param)
        if (isNaN(startDate.getTime()) || isNaN(startDate.getTime())) {
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31);
        }
    }
    return {startDate, endDate};
}