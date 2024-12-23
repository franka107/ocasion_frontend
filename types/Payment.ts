import type { BidDto } from './Bids'
import type { EventDto } from './Event'
import type { OfferDto } from './Offer'
import type { OrganizationDto } from './Organization'

export enum PaymentStatus {
  Concreted = 'CONCRETED', // Concretedo
  InReview = 'IN_REVIEW', // En revision
  Observed = 'OBSERVED', // Observado
  Base = 'BASE', // Observado
  Confirmed = 'CONFIRMED', // Confirmado
  Cancelled = 'CANCELLED', // Cancelado
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
