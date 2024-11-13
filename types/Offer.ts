import type { Organization } from '~/models/organizations'
import type { UserDto } from './Administrators'
import type { IEventLItem } from './Event'

export enum OfferStatus {
  Retired = 'RETIRED', // Retirado
  Confirmed = 'CONFIRMED', // Confirmado
  New = 'NEW', // Nuevo
  Debated = 'DEBATED', // Debadito
  Cancelled = 'CANCELLED', // Cancelado
  Rejected = 'REJECTED', // Rechazado
}

export interface OfferListItem {
  id: string
  title: string
  carModel: Model
  year: number
  initialValue: number
  description: string
  address: Address
  appraisal: number
  bid: Bid
  annexesFiles: AnnexesFile[]
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
  bidHistories?: BidHistory[]
  userId: string
  __entity: string
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
  organization?: Organization
  organizationId: string
  eventId?: string
}

export interface Model {
  id: string
  name: string
  brand: Brand
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
  id: string;
  name: string;
  path: string;
}
export interface AttachedFile {
  id: string
  path: string
  name:string
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
