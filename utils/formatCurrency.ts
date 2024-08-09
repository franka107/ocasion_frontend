
export default function (currency: number) {
    return  String(Math.round(currency)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}