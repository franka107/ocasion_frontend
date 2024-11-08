import { useEventSource } from '@vueuse/core'
import type { Notification } from '~/types/Notification'

const NOTIFICATION_BASE_URL = '/notifications'
export type QueryPaginatedParams = {
  limit: number
  page: number
  sortOptions: { field: string; order: 'asc' | 'desc' }[]
  filterOptions: {
    field: string
    type: 'like' | 'equal' | 'between' | 'in' | 'not-in' | 'not'
    value: any
  }[]
}

export class Paginated<T> {
  readonly count: number
  readonly limit: number
  readonly page: number
  readonly data: readonly T[]

  constructor(props: Paginated<T>) {
    this.count = props.count
    this.limit = props.limit
    this.page = props.page
    this.data = props.data
  }
}

export function useNotificationAPI() {
  const findNotificationsPaginated = async (query: QueryPaginatedParams) => {
    console.log('Query params:', query)
    const { status, error, data, refresh } = await useAPI<
      Paginated<Notification>
    >(`${NOTIFICATION_BASE_URL}/find-notifications-paginated`, {
      method: 'GET',
      query: {
        ...query,
        filterOptions: JSON.stringify(query.filterOptions),
        sortOptions: JSON.stringify(query.sortOptions),
      },
    } as any)
    console.log('API Response:', { status: status.value, error: error.value, data: data.value })

    return { status, error, data, refresh }
  }

  const listenDomainEvents = <T>(event: string) => {
    const { apiUrl } = useRuntimeConfig().public
    const { user } = useUserSession()

    const eventSource = useEventSource(
      `${apiUrl}${NOTIFICATION_BASE_URL}/listen-domain-events?token=${user.value?.token}`,
      [event],
      { autoReconnect: true },
    )
    return { data: eventSource.data as Ref<T> }
  }

  const removeNotifications = async (ids: string[]) => {
    const { status, error, data, refresh } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/mark-notifications-as-read`,
      {
        method: 'POST',
        body: {
          notificationIds: ids,
        },
      } as any,
    )
    return { status, error, data, refresh }
  }

  return {
    findNotificationsPaginated,
    listenDomainEvents,
    removeNotifications,
  }
}
