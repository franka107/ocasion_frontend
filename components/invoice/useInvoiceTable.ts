import { fi } from 'date-fns/locale'
import { number } from 'zod'
import consola from 'consola'
import type {
  HeaderItem,
  SearchItem,
  SearchSelectItem,
} from '../ui/custom-table/CustomTable.vue'
import {
  type FilterOption,
  type SortOption,
} from '~/composables/useNotificationAPI'
import { goodType } from '~/constants/events'
import type { OrganizationDto } from '~/types/Organization'

export enum InvoiceTableStoreKind {
  Success = 'SUCCESS',
  Loading = 'LOADING',
}

export type InvoiceTableSuccess = {
  kind: InvoiceTableStoreKind.Success
  organizationList: OrganizationDto[]
}

export type InvoiceTableLoading = {
  kind: InvoiceTableStoreKind.Loading
}

export type InvoiceTableStoreRoot = (
  | InvoiceTableSuccess
  | InvoiceTableLoading
) & {
  page: number
  limit: number
}

export const useInvoiceTableMvi = () => {
  const page = ref(1)
  const limit = ref(10)
  const sortOptions = ref<SortOption[]>([])
  const filterOptions = ref<FilterOption[]>([])
  const billingManagementService = useBillingManagementService()
  const organizationManagementService = useOrganization()

  const store = ref<InvoiceTableStoreRoot>({
    kind: InvoiceTableStoreKind.Loading,
    page: 1,
    limit: 10,
  })

  const onMounted = async () => {
    const viewOrganizationIdAndNameList =
      await organizationManagementService.viewOrganizationIdAndNameList()

    if (viewOrganizationIdAndNameList.status.value === 'success') {
      const rawStore = toRaw(store.value)

      store.value = {
        ...rawStore,
        kind: InvoiceTableStoreKind.Success,
        organizationList: viewOrganizationIdAndNameList.data,
      }
    }
    consola.info(`store kind ${store.value.kind}`)
  }

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

  const tableSearch = (organizationList: OrganizationDto[]): SearchItem[] => [
    {
      key: 'quickSearch',
      type: 'text',
      placeholder: 'T. oferta/N. de evento',
      position: 1,
    },
    {
      key: 'goodType',
      type: 'select',
      placeholder: 'Filtrar estados',
      items: [
        ...Array.from(goodType).map(([key, value]) => ({
          text: value,
          value: key,
        })),
        { text: 'Todos', value: '' },
      ] as SearchSelectItem[],
      position: 2,
    },
    {
      key: 'organization.id',
      type: 'select',
      placeholder: 'Organización',
      items: organizationList.map((org) => ({
        value: org.id,
        text: org.name,
      })) as SearchSelectItem[],
      position: 3,
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
    store,
    onMounted,
  }
}
