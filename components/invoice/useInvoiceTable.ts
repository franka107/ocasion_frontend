import { fi } from 'date-fns/locale'
import type { HeaderItem, SearchItem } from '../ui/custom-table/CustomTable.vue'
import {
  type FilterOption,
  type SortOption,
} from '~/composables/useNotificationAPI'

export const useInvoiceTableMvi = () => {
  const page = ref(1)
  const limit = ref(10)
  const sortOptions = ref<SortOption[]>([])
  const filterOptions = ref<FilterOption[]>([])

  const onSort = (sortObject: SortOption[]) => {
    sortOptions.value = sortObject
  }

  const onSearch = (item: { [key: string]: string }) => {
    filterOptions.value = [
      { field: 'offer.title', type: 'like', value: item.title || '' },
      {
        field: 'event.goodType',
        type: 'equal',
        value: item.eventGoodType || '',
      },
      { field: 'status', type: 'equal', value: item.status || '' },
    ]
  }

  const billingManagementService = useBillingManagementService()

  const tableHeaders: HeaderItem[] = [
    {
      key: 'offerEndTime',
      label: 'F. de cierre de oferta',
      sortable: true,
      align: 'center',
    },
    {
      key: 'paymentCreatedAt',
      sortable: true,
      label: 'F. de pago',
      align: 'center',
    },
    {
      key: 'offerLabel',
      sortable: true,
      label: 'Oferta',
      align: 'center',
    },
    {
      key: 'eventLabel',
      sortable: true,
      label: 'Evento',
      align: 'center',
    },
    {
      key: 'organization.name',
      sortable: true,
      label: 'Organización',
      align: 'center',
    },
    {
      key: 'eventGoodType',
      sortable: true,
      label: 'Tipo de activo',
      align: 'center',
    },
    {
      key: 'bidAmount',
      sortable: true,
      label: 'Valor de la puja',
      align: 'center',
    },
    {
      key: 'paymentComissionAmount',
      sortable: true,
      label: 'Comisión',
      align: 'center',
    },
    {
      key: 'invoiceFile',
      sortable: true,
      label: 'Recibo/Boleta',
      align: 'center',
    },
  ]

  const tableSearch: SearchItem[] = [
    {
      key: 'title',
      type: 'text',
      placeholder: 'Buscar oferta',
      elementClass: 'min-w-[400px]',
      position: 1,
    },
  ]

  const viewPaginatedInvoices = () => {
    return billingManagementService.viewPaginatedInvoices({
      limit: limit.value,
      filterOptions: filterOptions.value,
      sortOptions: sortOptions.value,
      page: page.value,
    })
  }

  return {
    tableHeaders,
    viewPaginatedInvoices,
    tableSearch,
    page,
    sortOptions,
    filterOptions,
    onSort,
    onSearch,
  }
}
