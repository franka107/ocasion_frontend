
export default function (currency: number, currencyType?: string) {
    if(currencyType) {
        return `${currencyType === 'USD'? '$': 'S./'} ${String(Math.round(currency)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
    return  String(Math.round(currency)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
