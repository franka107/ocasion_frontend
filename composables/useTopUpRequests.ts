import type { FilterOption } from './useNotificationAPI'

// by convention, composable function names start with "use"
export function useTopUpRequests() {
  const pendingFilter: FilterOption = {
    value: 'PENDING',
    type: 'equal',
    field: 'status',
  }
  const page = ref(1)
  const filterOptions = ref(JSON.stringify([pendingFilter]))
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const BASE_ORG_URL = '/finance/recharge-request-management'

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      pendingFilter,
      { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
      {
        field: 'transferedAt',
        type: 'between',
        value: item.transferedAt || '',
      },
      { field: 'createdAt', type: 'between', value: item.createdAt || '' },
    ]

    filterOptions.value = JSON.stringify(filters)
    page.value = 1
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
