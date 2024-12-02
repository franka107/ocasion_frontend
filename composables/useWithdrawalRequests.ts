// by convention, composable function names start with "use"
export function useWithdrawalRequests() {
  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const BASE_ORG_URL = '/finance/withdrawal-request-management'

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'id', type: 'like', value: item.id || '' },
      { field: 'createdAt', type: 'between', value: item.createdAt || '' },
      { field: 'transferedAt', type: 'between', value: item.transferedAt || '' },
    ]
    filterOptions.value = JSON.stringify(filters)
  }

  const requestWithdrawal = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/request-withdrawal`,
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
    sortOptions,
    onSort,
    requestWithdrawal,
    onSearch,
  }
}
