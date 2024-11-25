
import type { DisbursementLot } from '~/types/Disbursement'
const BASE_RECH_URL = '/finance/recharge-request-management'

export function useDisbursement() {
    const page = ref(1)
    const filterOptions = ref('[]')
    const sortOptions = ref('[]')
    const onSort = (sortObject: { [key: string]: string }[]) => {
      sortOptions.value = JSON.stringify(sortObject)
    }
  
    const onSearch = (item: { [key: string]: string }) => {
      const filters = [
        { field: 'id', type: 'like', value: item.id || '' },
        { field: 'name', type: 'like', value: item.name || '' },
      ]
      if (item.status) {
        filters.push({ field: 'status', type: 'equal', value: item.status })
      }
      if (item.bank) {
        filters.push({ field: 'bank', type: 'equal', value: item.bank })
      }
      filterOptions.value = JSON.stringify(filters)
    }
    const autorizationRecharge = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_RECH_URL}/autorization-recharge-requests`,
          {
            method: 'POST',
            body: values,
          } as any,
        )
        return { status, error }
    } 
    const rejectionRecharge = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_RECH_URL}/rejection-recharge-requests`,
          {
            method: 'POST',
            body: values,
          } as any,
        )
        return { status, error }
    }    
    const updateRecharge = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_RECH_URL}/update-recharge-requests`,
          {
            method: 'POST',
            body: values,
          } as any,
        )
        return { status, error }
    }  
    const requestRecharge = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_RECH_URL}/request-recharge`,
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
      onSearch,
      autorizationRecharge,
      rejectionRecharge, 
      updateRecharge,
      requestRecharge,
    }
  }
  