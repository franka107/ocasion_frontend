import { useEventSource } from "@vueuse/core";
import type { Notification } from "~/types/Notification";

const NOTIFICATION_BASE_URL = "/notifications";

export function useNotificationAPI() {
  const getNotReadedNotifications = async () => {
    const { status, error, data, refresh } = await useAPI<Notification[]>(
      `${NOTIFICATION_BASE_URL}/get-not-readed-notifications`,
      {
        method: "GET",
      } as any,
    );
    return { status, error, data, refresh };
  };

  const listenDomainEvents = <T>(event: string) => {
    const { apiUrl } = useRuntimeConfig().public;
    const { user } = useUserSession();

    const eventSource = useEventSource(
      `${apiUrl}${NOTIFICATION_BASE_URL}/listen-domain-events?token=${user.value?.token}`,
      [event],
      { autoReconnect: true },
    );
    return { data: eventSource.data as Ref<T> };
  };

  const removeNotifications = async (ids: string[]) => {
    const { status, error, data, refresh } = await useAPI<void>(
      `${NOTIFICATION_BASE_URL}/mark-notifications-as-read`,
      {
        method: "POST",
        body: {
          notificationIds: ids,
        },
      } as any,
    );
    return { status, error, data, refresh };
  };

  return { getNotReadedNotifications, listenDomainEvents, removeNotifications };
}
