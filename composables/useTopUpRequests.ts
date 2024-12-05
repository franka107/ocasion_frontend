// by convention, composable function names start with "use"
export function useTopUpRequests() {
  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const BASE_ORG_URL = '/finance/recharge-request-management'

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'id', type: 'like', value: item.id || '' },
      { field: 'transferedA', type: 'between', value: item.transferedAt || '' },
      { field: 'createdAt', type: 'between', value: item.createdAt || '' },
      { field: 'operationNumber', type: 'like', value: item.operationNumber || '' },
    ]
    if (item.status) {
      filters.push({ field: 'status', type: 'equal', value: item.status })
    }
    filterOptions.value = JSON.stringify(filters)
  }
  const requestRecharge = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/request-recharge`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const rejectRechargeRequest = async (values: any) => {
    const { data, status, error }: any = await useAPI(
      `${BASE_ORG_URL}/reject-recharge-request`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { data, status, error }
  }
  const authorizeRechargeRequest = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/authorize-recharge-request`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  return {
    page,
    filterOptions,
    requestRecharge,
    authorizeRechargeRequest,
    rejectRechargeRequest,
    sortOptions,
    onSort,
    onSearch,
  }
}
