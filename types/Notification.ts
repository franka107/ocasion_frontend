export enum NotificationTag {
  Event = 'EVENT',
  Offer = 'OFFER',
}
export interface Notification {
  id: string
  message: string
  tag: NotificationTag
  isRead: boolean
  createdAt: string
}

export const NotiificationStringMap = {
  [NotificationTag.Event]: 'EVENTO',
  [NotificationTag.Offer]: 'OFERTA',
}
