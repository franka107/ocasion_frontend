export enum NotificationTag {
  Event = 'EVENT',
}
export interface Notification {
  id: string
  message: string
  tag: NotificationTag
  createdAt: string
}

export const NotiificationStringMap = {
  [NotificationTag.Event]: 'EVENTO',
}
