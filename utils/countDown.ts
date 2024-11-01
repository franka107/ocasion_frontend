import dayjs from "dayjs"

export const getRemainingTime = (date: string | undefined) => {
    const currentDate = dayjs()
    const endDate = dayjs(date)
    const endMiliseconds = currentDate.diff(endDate, 'milliseconds')
    console.log("currentDateDiff", currentDate, endDate.format('DD/MM/YYYY'), currentDate.diff(endDate, 'minutes'))
    return endMiliseconds
}
