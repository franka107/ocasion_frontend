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
import { GoodType, goodType, goodTypeRecord } from '~/constants/events'
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

export const useInvoiceTableMvi = async () => {
  const page = ref(1)
  const limit = ref(5)
  const filterOptions = ref<FilterOption[]>([])
  const sortOptions = ref<SortOption[]>([])
  const billingManagementService = useBillingManagementService()
  const organizationManagementService = useOrganization()
  const goodTypeOptions = Object.keys(goodTypeRecord).map((key) => ({
    text: goodTypeRecord[key as GoodType].label,
    value: key,
  }))

  const filterOptionsRaw = computed(() => JSON.stringify(filterOptions.value))
  const sortOptionsRaw = computed(() => JSON.stringify(sortOptions.value))

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
    consola.info(`sortObject ${JSON.stringify(sortObject)}`)

    sortOptions.value = sortObject
  }

  const onSearch = (item: { [key: string]: string }) => {
    filterOptions.value = [
      { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
      {
        field: 'event.goodType',
        type: 'equal',
        value: item.eventGoodType || '',
      },
      {
        field: 'organization.id',
        type: 'equal',
        value: item.organizationId || '',
      },
    ]
  }

  const tableHeaders: HeaderItem[] = [
    {
      key: 'offerEndTime',
      realKey: 'offer.endTime',
      label: 'F. de cierre de oferta',
      sortable: true,
      align: 'center',
    },
    {
      key: 'paymentCreatedAt',
      realKey: 'payment.createdAt',
      sortable: true,
      label: 'F. de pago',
      align: 'center',
    },
    {
      key: 'offerLabel',
      realKey: 'offer.title',
      sortable: true,
      label: 'Oferta',
      align: 'center',
    },
    {
      key: 'eventLabel',
      realKey: 'event.name',
      sortable: true,
      label: 'Evento',
      align: 'center',
    },
    {
      key: 'organization.name',
      realKey: 'organization.name',
      sortable: true,
      label: 'Organización',
      align: 'center',
    },
    {
      key: 'eventGoodType',
      realKey: 'event.goodType',
      sortable: true,
      label: 'Tipo de activo',
      align: 'center',
    },
    {
      key: 'bidAmount',
      realKey: 'bid.amount',
      sortable: true,
      label: 'Valor de la puja',
      align: 'center',
    },
    {
      key: 'paymentComissionAmount',
      realKey: 'payment.comissionAmount',
      sortable: true,
      label: 'Comisión',
      align: 'center',
    },
    {
      key: 'invoiceFile',
      sortable: false,
      label: 'Recibo/Boleta',
      align: 'center',
    },
  ]

  const tableSearch = (organizationList: OrganizationDto[]): SearchItem[] => [
    {
      key: 'quickSearch',
      type: 'text',
      placeholder: 'T. oferta/N. de evento',
    },
    {
      key: 'eventGoodType',
      type: 'select',
      placeholder: 'Filtrar estados',
      items: [
        ...goodTypeOptions,
        { text: 'Todos', value: ' ' },
      ] as SearchSelectItem[],
      // isHidden: true,
    },
    {
      key: 'organizationId',
      type: 'select',
      placeholder: 'Organización',
      items: organizationList.map((org) => ({
        value: org.id,
        text: org.name,
      })) as SearchSelectItem[],
      position: 3,
    },
  ]

  const paginatedInvoices =
    await billingManagementService.viewPaginatedInvoices({
      limit,
      filterOptions: filterOptionsRaw,
      sortOptions: sortOptionsRaw,
      page,
    })

  return {
    tableHeaders,
    tableSearch,
    page,
    sortOptions,
    filterOptions,
    onSort,
    onSearch,
    store,
    onMounted,
    paginatedInvoices,
  }
}
