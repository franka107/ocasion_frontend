
import dayjs from "dayjs"
export function useAccountValidation() {
    const page = ref(1)
    const filterOptions = ref('[]')
    const sortOptions = ref('[]')
    const onSort = (sortObject: { [key: string]: string }[]) => {
      sortOptions.value = JSON.stringify(sortObject)
    }
    const BASE_VAL_URL = '/finance/account-validation'
  
    const onSearch = (item: { [key: string]: string }) => {
      const filters = [
        { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
        { field: 'createdAt', type: 'between', value: item.createdAt || '' },
      ]
      if (item.status) {
        filters.push({ field: 'status', type: 'equal', value: item.status })
      }
      if (item.bank) {
        filters.push({ field: 'bank', type: 'equal', value: item.bank })
      }
      filterOptions.value = JSON.stringify(filters)
    }
  
    const rejectAccountBank = async (values: any) => {
      const { status, error }: any = await useAPI(
        `${BASE_VAL_URL}/reject-account-bank`,
        {
          method: 'POST',
          body: values,
        } as any,
      )
      return { status, error }
    }
    const approvalAccountBank = async (values: any) => {
      const { status, error }: any = await useAPI(
        `${BASE_VAL_URL}/approval-account-bank`,
        {
          method: 'POST',
          body: values,
        } as any,
      )
      return { status, error }
    }
    const { openConfirmModal, updateConfirmModal } = useConfirmModal()
    const handleExport = async () => {
      openConfirmModal({
        title: 'Exportar validación de cuentas',
        message: '¿Estás seguro de que deseas exportar validación de cuenta(s)?',
        callback: async () => {
            const { data: response, error, status } = await useAPI<string | any>(`${BASE_VAL_URL}/export-account-validations?filterOptions=${filterOptions.value}`,{} as any)
            if (status.value === 'success') {
              // Convertir la respuesta en un blob
              const blob =new Blob([response.value], {
                type: 'text/plain'
              });
              // Crear un enlace temporal para la descarga
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.setAttribute('download', `transacciones-${dayjs().format('YYYY-MM-DD hh:mm:ss')}.csv`)
              document.body.appendChild(link)
              link.click()
              link.remove()
              // Liberar la URL del blob
              URL.revokeObjectURL(link.href)
              updateConfirmModal({
                  title: 'Exportación exitosa',
                  message: 'Las validaciones de cuentas han sido exportadas exitosamente.',
                  type: 'success',
                })
            
            } else {
              const eMsg =
                error.value?.data.message ||
                'Error al exportar validaciones de cuentas. Inténtalo de nuevo más tarde.'
              updateConfirmModal({
                title: 'Error al exportar validación de cuenta(s)',
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
      rejectAccountBank,
      approvalAccountBank,
      sortOptions,
      onSort,
      onSearch,
      handleExport,
    }
  }
  