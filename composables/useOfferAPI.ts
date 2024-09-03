import type { OfferItem } from "~/types/Offer"
import { useAPI } from "./useAPI"

const OFFER_BASE_URL = '/offer-management'
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
          `${OFFER_BASE_URL}/create-offer`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }
    
    const editOffer = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${OFFER_BASE_URL}/update-offer`,
          {
            method: "PUT",
            body: values,
          } as any
        );
        return { status, error}
    };
              
    const getOffer = async (id: number | string) => {
      const { status, error, data } = await useAPI<OfferItem>(
        `${OFFER_BASE_URL}/get-offer-detail`,
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
        `${OFFER_BASE_URL}/discuss-offer`,
        {
          method: "POST",
          body: values,
        } as any
      );
      return {status, error}
  }

   const confirmOffers = async (values: { type: string; ids: string[] }) => {
    const { status, error }: any = await useAPI(
      `${OFFER_BASE_URL}/confirm-offers`,
      {
        method: "POST",
        body: values,
      } as any
    );
  
    return { status, error };
  };
    const retireOffers = async (values: { type: string; ids: string[] }) => {
      const { status, error }: any = await useAPI(
        `${OFFER_BASE_URL}/retire-offers`,
        {
          method: "POST",
          body: values,
        } as any
      );
    
      return { status, error };
    };
   

  return { page,  sortOptions, onSort, createOffer, editOffer, getOffer, discussOffer, confirmOffers, retireOffers }
}