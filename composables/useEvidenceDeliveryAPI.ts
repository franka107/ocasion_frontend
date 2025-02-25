import { useAPI } from './useAPI'

const BASE_DELIVERY_URL = '/delivery-management'

export function useEvidenceDeliveryAPI() {
  const page = ref(1)
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const getDeliverySupport = async (id: number | string) => {
    const { status, error, data, refresh }: any = await useAPI(
      `${BASE_DELIVERY_URL}/get-aaadelivery-support-detail`,
      {
        method: 'GET',
        query: {
          id,
        },
      } as any,
    )

    return { status, error, data, refresh }
  }

  const confirmDeliverySupport = async (values: {
    deliverySupportId: string
  }) => {
    const { status, error }: any = await useAPI(
      `${BASE_DELIVERY_URL}/confirm-delivery-support`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const editDeliverySupport = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_DELIVERY_URL}/update-delivery-support`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  return {
    getDeliverySupport,
    confirmDeliverySupport,
    editDeliverySupport,
    page,
    sortOptions,
    onSort,
  }
}
