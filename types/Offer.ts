import type { UserDto } from './Administrators'
import type { BidDto } from './Bids'
import type { IEventLItem } from './Event'
import type { Organization } from '~/models/organizations'

export enum OfferStatus {
  Created = 'CREATED', // Nuevo
  Debated = 'DEBATED', // Debadito
  Confirmed = 'CONFIRMED', // Confirmado
  Retired = 'RETIRED', // Retirado
  InProgress = 'IN_PROGRESS', // En curso
  Cancelled = 'CANCELLED', // Cancelado
  InReview = 'IN_REVIEW', // En revision
  Rejected = 'REJECTED', // Rechazado
  InDepositReview = 'IN_DEPOSIT_REVIEW', // Rechazado
  PendingDeposit = 'PENDING_DEPOSIT', // Abono pendiente
  ObservedDeposit = 'OBSERVED_DEPOSIT', // Abono observado
  ConfirmedDeposit = 'CONFIRMED_DEPOSIT', // Deposito confirmado
  InTransferOfGood = 'IN_TRANSFER_OF_GOOD', // En transferencia de bienes
  DebatedBid = 'DEBATED_BID', // Puja debatida PSD-63
  Delivered = 'DELIVERED', // Enviado
  Concreted = 'CONCRETED', // Concreatedo
  // -----------------
  PendingOfDelivery = 'PENDING_OF_DELIVERY', // Pendiente de entrega
}

export interface OfferListItem {
  id: string
  title: string
  carModel: Model
  carBrand: Brand
  year: number
  initialValue: number
  description: string
  address: Address
  appraisal: number
  bids: Bid[]
  bidHistories: BidHistory[]
  annexesFiles: AnnexesFile[]
  event?: IEventLItem
  attachedFiles: AttachedFile[]
  status: OfferStatus
  endTime?: string
  createdAt: string
  updatedAt: string
}
export interface Bid {
  id: string
  amount: number
  status: string
  createdAt: string
  offerId: string
  userId: string
  user: UserDto
  __entity: string
  guaranteedAmount: GuaranteedAmount
}

export interface GuaranteedAmount {
  pseudonym: string
}

export interface BidHistory {
  initialAmount: number
  modifiedAmount: number
  createdAt: string
  updatedAt: string
  user: UserDto
}

export interface OfferDto {
  id: string
  title: string
  carModel: Model
  carBrand: Brand
  year: number
  initialValue: number
  description: string
  address: Address
  appraisal: number
  counterProposalAmount?: any
  annexesFiles: AnnexesFile[]
  attachedFiles: AttachedFile[]
  status: OfferStatus
  endTime?: string
  createdAt: string
  updatedAt: string
  event?: IEventLItem
  organization: Organization
  bids: BidDto[]
  organizationId: string
  eventId?: string
}

export interface Model {
  id: string
  name: string
  carBrand: Brand
}

export interface Brand {
  id: string
  name: string
}

export interface Address {
  addressLine1: string
  district: District
  latitude: number
  longitude: number
}

export interface District {
  id: string
  name: string
  city: City
}

export interface City {
  id: string
  name: string
  state: State
}

export interface State {
  id: string
  name: string
}

export interface AnnexesFile {
  id: string
  name: string
  path: string
}
export interface AttachedFile {
  id: string
  path: string
  name: string
}

export interface IDebateForm {
  id: string
  name: string
  counterProposalAmount: number
  appraisal: number
}

export interface IAmountHistoryModal {
  bidId: string
}
export interface IChangeAppraisalForm {
  offerId: string
  offerName: string
  oldAppraisal: number
  counterProposalAmount: number | null
  newAppraisal: number
}
