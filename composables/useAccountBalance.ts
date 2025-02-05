export function useAccountBalance() {
  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const BASE_WALL_URL = '/finance/wallet-management'
  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
      {
        field: 'quickSearchPeriod',
        type: 'in',
        value: item.quickSearchPeriod || '',
      },
    ]
    filterOptions.value = JSON.stringify(filters)
    page.value = 1
  }
  const requestRecharge = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_WALL_URL}/request-recharge`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const rejectRechargeRequest = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_WALL_URL}/reject-recharge-request`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }
  const authorizeRechargeRequest = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_WALL_URL}/authorize-recharge-request`,
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
