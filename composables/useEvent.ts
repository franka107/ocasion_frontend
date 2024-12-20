import type { EventDto } from '~/types/Event'

const EVENT_BASE_URL = '/event-management'
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
      `${EVENT_BASE_URL}/create-event`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const editEvent = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${EVENT_BASE_URL}/update-event`,
      {
        method: 'PUT',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const getEvent = async (id: number | string) => {
    const { status, error, data, refresh } = await useAPI<EventDto>(
      `${EVENT_BASE_URL}/get-event-detail`,
      {
        method: 'GET',
        query: {
          id,
        },
      } as any,
    )
    return { status, error, data, refresh }
  }

  const cancelEvent = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${EVENT_BASE_URL}/cancel-event`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }
  const publishEvent = async (eventId: string) => {
    const { status, error }: any = await useAPI(
      `${EVENT_BASE_URL}/publish-event`,
      {
        method: 'POST',
        body: JSON.stringify({ eventId }),
        headers: {
          'Content-Type': 'application/json',
        },
      } as any,
    )
    return { status, error }
  }
  return {
    page,
    sortOptions,
    onSort,
    createEvent,
    editEvent,
    getEvent,
    cancelEvent,
    publishEvent,
  }
}
