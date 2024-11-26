
import type { DisbursementLot } from '~/types/Disbursement'
const BASE_DIS_URL = '/finance/disbursement-management'

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
        id: string,
        paymentSupportFile: {},
        disbursedAt: {}
    }) => {
        const { status, error} = await useAPI(
          `${BASE_DIS_URL}/confirm-disbursement-lot`,
          {
            method: 'POST',
            body: values,
          } as any,
        )
        return { status, error }
    } 
    const generatelPreviewDisbursement = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_DIS_URL}/generate-disbursement-lot-preview`,
          {
            method: 'POST',
            body: values,
          } as any,
        )
        return { status, error }
    }    
    const generatelDisbursement = async (values: any) => {
        const { status, error } = await useAPI(
          `${BASE_DIS_URL}/generate-disbursement-lot`,
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
      annulDisbursement,
      confirmDisbursement, 
      generatelPreviewDisbursement,
      generatelDisbursement,
    }
  }
  