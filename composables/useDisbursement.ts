import dayjs from 'dayjs'
import type { FilterOption } from './useNotificationAPI'
import type { Bank, DisbursementLot } from '~/types/Disbursement'
const BASE_DIS_URL = '/finance/disbursement-management'

export function useDisbursement(
  type: 'all' | 'only-pendings' | 'not-pendings',
) {
  const onlyPendingsSearch: FilterOption = {
    field: 'status',
    type: 'equal',
    value: 'PENDING',
  }
  const notPendingsSearch: FilterOption = {
    field: 'status',
    type: 'not',
    value: 'PENDING',
  }

  const baseTypeSearch: FilterOption[] =
    type === 'not-pendings'
      ? [notPendingsSearch]
      : type === 'only-pendings'
        ? [onlyPendingsSearch]
        : []
  const page = ref(1)
  const filterOptions = ref(JSON.stringify(baseTypeSearch))
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      ...baseTypeSearch,
      { field: 'id', type: 'like', value: item.id || '' },
      { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
      { field: 'status', type: 'equal', value: item.status || '' },
      { field: 'createdAt', type: 'between', value: item.createdAt || '' },
      {
        field: 'transferedAt',
        type: 'between',
        value: item.transferedAt || '',
      },
    ]
    if (item.status) {
      filters.push({ field: 'status', type: 'equal', value: item.status })
    }
    if (item.bank) {
      filters.push({ field: 'bank', type: 'equal', value: item.bank })
    }
    filterOptions.value = JSON.stringify(filters)
    page.value = 1
  }
  const annulDisbursement = async (values: any) => {
    const { status, error } = await useAPI(
      `${BASE_DIS_URL}/annul-disbursement-lot`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }
  const confirmDisbursement = async (values: {
    id: string
    paymentSupportFile: {}
    // disbursedAt: {}
  }) => {
    const { status, error } = await useAPI(
      `${BASE_DIS_URL}/confirm-disbursement-lot`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }
  const generatelPreviewDisbursement = async (values: any) => {
    const { data, status, error } = await useAPI(
      `${BASE_DIS_URL}/generate-disbursement-lot-preview`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { data, status, error }
  }

  const viewAvailableBankAccounts = async (bank: Bank) => {
    try {
      const response = await useAPI(
        `${BASE_DIS_URL}/view-available-bank-accounts`,
        {
          default: () => [],
          query: {
            bank,
          },
        },
      )
      return response
    } catch (error) {
      console.error('Error al cargar cuentas disponibles:', error)
    }
  }

  const generatelDisbursement = async (values: any) => {
    const { status, error, data } = await useAPI(
      `${BASE_DIS_URL}/generate-disbursement-lot`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error, data }
  }
  const { openConfirmModal, updateConfirmModal } = useConfirmModal()
  const handleExport = async () => {
    openConfirmModal({
      title: 'Exportar reporte de lotes de desembolso',
      message:
        '¿Estás seguro de que deseas exportar reporte(s) de lote(s) de desembolso?',
      callback: async () => {
        const {
          data: response,
          error,
          status,
        } = await useAPI<string | any>(
          `${BASE_DIS_URL}/export-disbursement-lots?filterOptions=${filterOptions.value}`,
          {} as any,
        )
        if (status.value === 'success') {
          // Convertir la respuesta en un blob
          const blob = new Blob([response.value], {
            type: 'text/plain',
          })
          // Crear un enlace temporal para la descarga
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.setAttribute(
            'download',
            `transacciones-${dayjs().format('YYYY-MM-DD hh:mm:ss')}.csv`,
          )
          document.body.appendChild(link)
          link.click()
          link.remove()
          // Liberar la URL del blob
          URL.revokeObjectURL(link.href)
          updateConfirmModal({
            title: 'Exportación exitosa',
            message:
              'Los reportes de lotes de desembolso han sido exportadas exitosamente.',
            type: 'success',
          })
        } else {
          const eMsg =
            error.value?.data.message ||
            'Error al exportar reporte(s) de lotes de desembolso. Inténtalo de nuevo más tarde.'
          updateConfirmModal({
            title: 'Error al exportar transacciones',
            message: String(eMsg),
            type: 'error',
          })
        }
      },
    })
  }
  return {
    page,
    filterOptions,
    sortOptions,
    onSort,
    onSearch,
    annulDisbursement,
    confirmDisbursement,
    generatelPreviewDisbursement,
    generatelDisbursement,
    handleExport,
    viewAvailableBankAccounts,
  }
}
