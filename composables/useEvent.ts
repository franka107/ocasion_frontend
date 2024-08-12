
const BASE_ORG_URL = '/event-management'
// by convention, composable function names start with "use"
export function useEvent() {
    // state encapsulated and managed by the composable
    const page = ref(1)
    const sortOptions = ref('[]')
    const onSort = (sortObject: { [key: string]: string }[]) => {
        sortOptions.value = JSON.stringify(sortObject)
    }
    const createEvent = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_ORG_URL}/create-event`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }
    
    const editEvent = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_ORG_URL}/update-event`,
          {
            method: "PUT",
            body: values,
          } as any
        );
        return { status, error}
    };
      
  return { page,  sortOptions, onSort, createEvent, editEvent }
}