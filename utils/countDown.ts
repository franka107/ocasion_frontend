import dayjs from "dayjs"

export const getRemainingTime = (date: string | undefined) => {
    if(date) {
        const currentDate = dayjs()
        const endDate = dayjs(date)
        const endMiliseconds = endDate.diff(currentDate, 'milliseconds')
        return endMiliseconds
    }
    return 0
}
