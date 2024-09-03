import type { OfferItem } from "~/types/Offer"
import { useAPI } from "./useAPI"

const EVENT_BASE_URL = '/offer-management'
const EVENT_PUBLISH_URL = '/event-management'
// by convention, composable function names start with "use"
export function useOfferAPI() {
    // state encapsulated and managed by the composable
    const page = ref(1)
    const sortOptions = ref('[]')
   
    const onSort = (sortObject: { [key: string]: string }[]) => {
      sortOptions.value = JSON.stringify(sortObject)
    }

    const createOffer = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${EVENT_BASE_URL}/create-offer`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }
    
    const editOffer = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${EVENT_BASE_URL}/update-offer`,
          {
            method: "PUT",
            body: values,
          } as any
        );
        return { status, error}
    };
              
    const getOffer = async (id: number | string) => {
      const { status, error, data } = await useAPI<OfferItem>(
        `${EVENT_BASE_URL}/get-offer-detail`,
        {
          method: "GET",
          query: {
            id,
          },
        } as any
      );
      return { status, error, data}
  };
    const discussOffer = async (values: { offerId: string, counterProposalAmount: number}) => {
      const { status, error }: any = await useAPI(
        `${EVENT_BASE_URL}/discuss-offer`,
        {
          method: "POST",
          body: values,
        } as any
      );
      return {status, error}
  }
  
  const publishEvent = async (eventId: string) => {
    const { status, error }: any = await useAPI(
      `${EVENT_PUBLISH_URL}/publish-event`,
      {
        method: "POST",
        body: JSON.stringify({ eventId }), 
        headers: {
          'Content-Type': 'application/json',
        },
      } as any
    );
    return {status, error}
   }

  return { page,  sortOptions, onSort, createOffer, editOffer, getOffer, discussOffer, publishEvent }
}