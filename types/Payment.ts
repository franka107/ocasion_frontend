import type { BidDto } from './Bids'
import type { EventDto } from './Event'
import type { OfferDto } from './Offer'
import type { OrganizationDto } from './Organization'
import type { Color } from '~/constants/ui'

export enum PaymentStatus {
  Concreted = 'CONCRETED', // Concretedo
  InReview = 'IN_REVIEW', // En revision
  Observed = 'OBSERVED', // Observado
  Base = 'BASE', // Observado
  Confirmed = 'CONFIRMED', // Confirmado
  Cancelled = 'CANCELLED', // Cancelado
}

export enum CompostPaymentStatus {
  InReview = 'IN_REVIEW', // En revision
  Observed = 'OBSERVED', // Observado
  Confirmed = 'CONFIRMED', // Confirmado
}

export const compostPaymentStatusRecord: Record<
  CompostPaymentStatus,
  { label: string; color: Color }
> = {
  [CompostPaymentStatus.InReview]: {
    label: 'En revisión',
    color: 'blue',
  },
  [CompostPaymentStatus.Observed]: {
    label: 'Observado',
    color: 'yellow',
  },
  [CompostPaymentStatus.Confirmed]: {
    label: 'Confirmado',
    color: 'green',
  },
}

export const paymentStatusRecord: Record<
  PaymentStatus,
  { label: string; color: string; icon: string; iconClass: string }
> = {
  [PaymentStatus.Concreted]: {
    label: 'Concretado',
    color: 'green',
    icon: 'Doc-Transfer',
    iconClass: 'text-green-500',
  },
  [PaymentStatus.InReview]: {
    label: 'En revisión',
    color: 'blue',
    icon: 'Doc-Transfer',
    iconClass: 'text-blue-500',
  },
  [PaymentStatus.Observed]: {
    label: 'Observado',
    color: 'yellow',
    icon: 'Doc-Transfer',
    iconClass: 'text-yellow-500',
  },
  [PaymentStatus.Base]: {
    label: 'Inicial',
    color: 'brown',
    icon: 'Doc-Transfer',
    iconClass: 'text-[#a1a1a3]',
  },
  [PaymentStatus.Confirmed]: {
    label: 'Confirmado',
    color: 'green',
    icon: 'Doc-Transfer',
    iconClass: 'text-green-500',
  },
  [PaymentStatus.Cancelled]: {
    label: 'Cancelado',
    color: 'red',
    icon: 'Doc-Transfer',
    iconClass: 'text-red-500',
  },
}

export interface PaymentDto {
  id: string
  offer: OfferDto
  bid: BidDto
  event: EventDto
  organization: OrganizationDto
  submittedAt: string
  amount: number
  status: PaymentStatus
}
