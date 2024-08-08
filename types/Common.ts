export interface RefDataResponse2 {
    value: DataResponse
}
export interface RefData {
    data?: RefDataResponse2
    status?: any
    error?: Function
    refresh?: Function
    clear?: Function
}
export interface DataResponse {
    count: number
    limit: number
    page: number
    data: any[]
}
  