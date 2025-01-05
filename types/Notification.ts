export enum NotificationTag {
  Event = 'EVENT',
  Abono = 'ABONO', // Remove
  Payment = 'PAYMENT',
  Offer = 'OFFER',
  Finance = 'FINANCE',
  Default = 'DEFAULT',
  Sustentation = 'SUSTENTATION',
  GodTransferenceSustentation = 'GOD_TRANSFERENCE_SUSTENTATION',
  GodDeliverySustentation = 'GOD_DELIVERY_SUSTENTATION',
}

export interface Notification {
  id: string
  message: string
  tag: NotificationTag
  isRead: boolean
  createdAt: string
  messageDetail?: string
  metadata?: {
    type: string
    offerId?: string
    offerTitle?: string
  }
}

export const notificationTagRecord: Record<
  NotificationTag,
  { label: string; tagClass: string }
> = {
  [NotificationTag.Event]: {
    label: 'Evento',
    tagClass: 'bg-[#EFF6FF] text-[#2563EB]', // Azul
  },
  [NotificationTag.Abono]: {
    label: 'Abono',
    tagClass: 'bg-[#E0F2FE] text-[#0284C7]', // Azul claro
  },
  [NotificationTag.Payment]: {
    label: 'Abono',
    tagClass: 'bg-[#E0F2FE] text-[#0284C7]', // Azul claro
  },
  [NotificationTag.Offer]: {
    label: 'Oferta',
    tagClass: 'bg-[#FDF2F8] text-[#DB2777]', // Rosa
  },
  [NotificationTag.Finance]: {
    label: 'Finanzas',
    tagClass: 'bg-[#FDE68A] text-[#D97706]', // Amarillo
  },
  [NotificationTag.Default]: {
    label: 'General',
    tagClass: 'bg-gray-100 text-gray-500', // Gris predeterminado
  },
  [NotificationTag.Sustentation]: {
    label: 'Sustento',
    tagClass: 'bg-[#FEF3F2] text-[#B91C1C]', // Rojo claro
  },
  [NotificationTag.GodTransferenceSustentation]: {
    label: 'Sustento de transferencia',
    tagClass: 'bg-[#FEF3F2] text-[#B91C1C]', // Rojo claro
  },
  [NotificationTag.GodDeliverySustentation]: {
    label: 'Sustento',
    tagClass: 'bg-[#F0FDF4] text-[#16A34A]', // Verde
  },
}
