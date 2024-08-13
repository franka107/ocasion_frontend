import { useEventSource } from "@vueuse/core";
import type { Notification } from "~/types/Notification";

const NOTIFICATION_BASE_URL = "/notifications";

export function useNotificationAPI() {
	const getNotReadedNotifications = async () => {
		const { status, error, data, refresh } = await useAPI<Notification[]>(
			`${NOTIFICATION_BASE_URL}/get-not-readed-notifications`,
			{
				method: "GET",
			}  as any
		)
		return { status, error, data, refresh }
	};

	const removeNotifications = async (ids: string[]) => {
		const { status, error, data, refresh } = await useAPI<void>(
			`${NOTIFICATION_BASE_URL}/mark-notifications-as-read`,
			{
				method: "POST",
				body: {
					notificationIds: ids
				}
			}  as any
		)
		return { status, error, data, refresh }
	};

	const listenNotificationReadedEvent = () => {
		const { apiUrl } = useRuntimeConfig().public;
		const eventSource = useEventSource(
      `${apiUrl}${NOTIFICATION_BASE_URL}/listen-notification-readed-event`,
      ["NotificationReadedDomainEvent"],
      { autoReconnect: true }
    );
		return eventSource
	}

	const listenNotificationCreatedEvent = () => {
		const { apiUrl } = useRuntimeConfig().public;
		const eventSource = useEventSource(
      `${apiUrl}${NOTIFICATION_BASE_URL}/listen-notification-created-event`,
      ["NotificationCreatedDomainEvent"],
      { autoReconnect: true }
    );
		return eventSource
	}
  return { getNotReadedNotifications, listenNotificationCreatedEvent, listenNotificationRemovedEvent: listenNotificationReadedEvent, removeNotifications };

}
