import { useEventSource } from '@vueuse/core'
import type { FilterEnum } from 'zod'
import type { IDataResponse } from '~/types/Common'
import type { Notification } from '~/types/Notification'

const NOTIFICATION_BASE_URL = '/notifications'
export type FilterOption = {
  field: string
  type: 'like' | 'equal' | 'between' | 'in' | 'not-in' | 'not'
  value: any
}

export type QueryPaginatedParams = {
  limit: number
  page: number
  sortOptions: { field: string; order: 'asc' | 'desc' }[]
  filterOptions: FilterOption[]
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
  const page = ref(1)
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }
  const findNotificationsPaginated = async (query: QueryPaginatedParams) => {
    const { status, error, data, refresh } = await useAPI<
      IDataResponse<Notification>
    >(`${NOTIFICATION_BASE_URL}/find-notifications-paginated`, {
      method: 'GET',
      query: {
        ...query,
        filterOptions: JSON.stringify(query.filterOptions),
        sortOptions: JSON.stringify(query.sortOptions),
      },
    } as any)

    return { status, error, data, refresh }
  }

  const getNotReadedNotificationsCount = async () => {
    const { status, error, data, refresh } = await useAPI<
      IDataResponse<Notification>
    >(`${NOTIFICATION_BASE_URL}/get-not-readed-notifications-count`, {
      method: 'GET',
    } as any)

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
      `${NOTIFICATION_BASE_URL}/remove-notifications`,
      {
        method: 'DELETE',
        body: {
          notificationIds: ids,
        },
      } as any,
    )
    return { status, error, data, refresh }
  }

  const removeNotification = async (id: string) => {
    const { status, error, data, refresh } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/remove-notification`,
      {
        method: 'DELETE',
        body: {
          id,
        },
      } as any,
    )
    return { status, error, data, refresh }
  }

  const markAllNotificationsAsReadByParticipant = async (values: {
    type: string
    ids: string[]
  }) => {
    const { status, error } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/mark-all-notifications-as-read-by-participant`,
      {
        method: 'POST',
        body: {
          values,
        },
      } as any,
    )
    return { status, error }
  }

  const removeAllNotificationsByParticipant = async (values: {
    type: string
    ids: string[]
  }) => {
    const { status, error } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/remove-all-notifications-by-participant`,
      {
        method: 'POST',
        body: {
          values,
        },
      } as any,
    )
    return { status, error }
  }

  const readNotification = async (id: string) => {
    const { status, error, data, refresh } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/read-notification`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return { status, error, data, refresh }
  }

  return {
    findNotificationsPaginated,
    listenDomainEvents,
    removeNotifications,
    getNotReadedNotificationsCount,
    removeNotification,
    readNotification,
    page,
    sortOptions,
    onSort,
    removeAllNotificationsByParticipant,
    markAllNotificationsAsReadByParticipant,
  }
}
