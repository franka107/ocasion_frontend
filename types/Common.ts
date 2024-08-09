export interface RefDataResponse2<T> {
    value: IDataResponse<T>
}
export interface RefData<T> {
    data?: RefDataResponse2<T>
    status?: any
    error?: Function
    refresh?: Function
    clear?: Function
}
export interface IDataResponse<T> {
    count: number
    limit: number
    page: number
    data: T[]
}
  