import { useAPI } from './useAPI'

const BASE_PAY_URL = '/payment-management'

export function usePaymentAPI() {
  const page = ref(1)
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const observeComissionPayment = async (values: {
    paymentId: string
    reason: string
  }) => {
    const { status, error }: any = await useAPI(
      `${BASE_PAY_URL}/observe-comission-payment`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const observePropertyPayment = async (values: {
    paymentId: string
    reason: string
  }) => {
    const { status, error }: any = await useAPI(
      `${BASE_PAY_URL}/observe-comission-payment`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const confirmComissionPayment = async (values: { paymentId: string }) => {
    const { status, error }: any = await useAPI(
      `${BASE_PAY_URL}/confirm-comission-payment`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const confirmPropertyPayment = async (values: { paymentId: string }) => {
    const { status, error }: any = await useAPI(
      `${BASE_PAY_URL}/confirm-property-payment`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const uploadCompostSupportFiles = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_PAY_URL}/upload-compost-support-files`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  return {
    confirmComissionPayment,
    confirmPropertyPayment,
    observeComissionPayment,
    observePropertyPayment,
    sortOptions,
    page,
    onSort,
    uploadCompostSupportFiles,
  }
}
