import type { OfferItem } from "~/types/Offer"

const EVENT_BASE_URL = '/offer-management'
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
  return { page,  sortOptions, onSort, createOffer, editOffer, getOffer }
}