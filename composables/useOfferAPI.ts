import type { IEventLItem } from "~/types/Event"

const EVENT_BASE_URL = '/event-management'
// by convention, composable function names start with "use"
export function useOfferAPI() {
    // state encapsulated and managed by the composable
    const page = ref(1)
    const filterOptions = ref('[]')
    const sortOptions = ref('[]')
   
    const onSort = (sortObject: { [key: string]: string }[]) => {
      sortOptions.value = JSON.stringify(sortObject)
    }
    const onSearch = (item: {[key: string]: string }) => {
      const filters = [
        { field: 'title', type: 'like', value: item.title || '' },
      ]
      filterOptions.value = JSON.stringify(filters)
    }
    const createOffer = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${EVENT_BASE_URL}/create-event`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }
    
    const editOffer = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${EVENT_BASE_URL}/update-event`,
          {
            method: "PUT",
            body: values,
          } as any
        );
        return { status, error}
    };
  return { page,  sortOptions, filterOptions, onSearch, onSort, createOffer, editOffer }
}