import { useAPI } from './useAPI'
import type { OfferDto } from '~/types/Offer'

const EVENT_BASE_URL = '/offer-management'
const EVENT_PUBLISH_URL = '/event-management'
const OFFER_BASE_URL = '/offer-management'
// by convention, composable function names start with "use"
export function useOfferAPI() {
  // state encapsulated and managed by the composable
  const page = ref(1)
  const sortOptions = ref('[]')

  const createOffer = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/create-offer`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const editOffer = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/update-offer`,
      {
        method: 'PUT',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const modifyOfferAppraisal = async (values: {
    offerId: string
    newAppraisal: number
  }) => {
    const { status, error }: any = await useAPI(
      `${EVENT_BASE_URL}/modify-offer-appraisal`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const getOffer = async (id: number | string) => {
    const { status, error, data } = await useAPI<OfferDto>(
      `${OFFER_BASE_URL}/get-offer-detail`,
      {
        method: 'GET',
        query: {
          id,
        },
      } as any,
    )
    return { status, error, data }
  }
  const discussOffer = async (values: {
    offerId: string
    counterProposalAmount: number
  }) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/discuss-offer`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const confirmOffers = async (values: {
    type: string
    ids: string[]
    eventId: string
  }) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/confirm-offers`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const rejectOffers = async (values: {
    type: string
    ids: string[]
    eventId: string
  }) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/reject-offers`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const retireOffers = async (values: {
    type: string
    ids: string[]
    eventId: string
  }) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/retire-offers`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  return {
    page,
    onSort,
    sortOptions,
    modifyOfferAppraisal,
    createOffer,
    editOffer,
    getOffer,
    discussOffer,
    confirmOffers,
    rejectOffers,
    retireOffers,
  }
}
