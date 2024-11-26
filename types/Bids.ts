import type { UserDto } from './Administrators'
import type { OfferDto } from './Offer'

export enum BidStatus {
  Started = 'STARTED', // Iniciado
  Discarded = 'DISCARDED', // Descartado
  Rejected = 'REJECTED', // Rechazado
  Debated = 'DEBATED', // Debatido
  Accepted = 'ACCEPTED', // Aceptado
  Winner = 'WINNER', // Ganadora
}

export interface OfferWithBidDto {
  id: string
  title: string
  appraisal: number
  bid: {
    createdAt: string // Iso Format
    amount: number
    status: BidStatus[]
  }
}

export interface BidDto {
  id: string
  user: UserDto
  amount: number
  offer: OfferDto
  status: BidStatus
  createdAt: Date
}
