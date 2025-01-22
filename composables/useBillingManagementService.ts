import type { FilterOption, SortOption } from './useNotificationAPI'
import type { PlaceBidParamsDto } from '~/types/Bids'

const BILLING_MANAGEMENT_BASE_URL = '/billing-management'

export function useBillingManagementService() {
  const viewPaginatedInvoicesForParticipant = (params: {
    limit: number
    filterOptions: FilterOption[]
    sortOptions: SortOption[]
    page: number
  }) => {
    return useAPI(
      `${BILLING_MANAGEMENT_BASE_URL}/view-paginated-invoices-for-participant`,
      {
        method: 'GET',
        query: {
          limit: params.limit,
          filterOptions: JSON.stringify(params.filterOptions),
          sortOptions: JSON.stringify(params.sortOptions),
          page: params.page,
        },
        default: () => {
          return {
            data: [],
            count: 0,
            limit: 10,
            page: 0,
          }
        },
      },
    )
  }

  return {
    viewPaginatedInvoices: viewPaginatedInvoicesForParticipant,
  }
}
