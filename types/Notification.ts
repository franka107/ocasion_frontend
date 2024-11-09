export enum NotificationTag {
  Event = 'EVENT',
  Offer = 'OFFER',
  Delivery = 'DELIVERY',
  Alert = 'ALERT'
}

export interface Notification {
  id: string
  message: string
  tag: NotificationTag
  isRead: boolean
  createdAt: string
}

export const NotiificationStringMap = {
  [NotificationTag.Event]: 'Evento',
  [NotificationTag.Offer]: 'Oferta',
  [NotificationTag.Delivery]: 'Sustento de entrega',
  [NotificationTag.Alert]: 'Alerta'
}



