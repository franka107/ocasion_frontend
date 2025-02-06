import dayjs from 'dayjs'
import type { IDataResponse } from '~/types/Common'
import type { TransactionHistoryListItem } from '~/types/TransactionHistory'

// by convention, composable function names start with "use"
export function useTransactionParticipant(
  type: 'all' | 'only-pendings' | 'not-pendings',
) {
  const notPendingsSearch: FilterOption = {
    field: 'status',
    type: 'not',
    value: 'PENDING',
  }
  const onlyPendingsSearch: FilterOption = {
    field: 'status',
    type: 'equal',
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
  const BASE_TRANSACTION_URL = '/finance/transaction-history-management'

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      ...baseTypeSearch,
      { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
      { field: 'status', type: 'equal', value: item.status || '' },
      { field: 'createdAt', type: 'between', value: item.createdAt || '' },
      { field: 'motive', type: 'equal', value: item.motive || '' },
    ]
    if (item.status) {
      filters.push({ field: 'status', type: 'equal', value: item.status })
    }
    filterOptions.value = JSON.stringify(filters)
    page.value = 1
  }

  const { openConfirmModal, updateConfirmModal } = useConfirmModal()

  const handleExport = async () => {
    openConfirmModal({
      title: 'Exportar transacciones',
      message: '¿Estás seguro de que deseas exportar las transacciones?',
      callback: async () => {
        const {
          data: response,
          error,
          status,
        } = await useAPI<string | any>(
          `${BASE_TRANSACTION_URL}/export-transaction-histories?filterOptions=${filterOptions.value}`,
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
            message: 'Los transacciones han sido exportadas exitosamente.',
            type: 'success',
          })
        } else {
          const eMsg =
            error.value?.data.message ||
            'Error al exportar transacciones. Inténtalo de nuevo más tarde.'
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
    handleExport,
  }
}
