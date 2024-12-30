import type { BidDto } from './Bids'
import type { PaymentDto } from './Payment'
import type { OrganizationDto } from './Organization'
import type { OfferDto } from './Offer'
import type { EventDto } from './Event'
import type { FileType } from './Disbursement'
import type { Participant } from './Recharge'
import type { UserDto } from './Administrators'
import type { Organization } from '~/models/organizations'
import type { CustomChipVariants } from '~/components/ui/custom-chip'

export interface EvidenseItem {
  id: string
  title: string
  carModel: CarModel
  initialValue: number
  year: number
  description: string
  address: Address
  appraisal: number
  annexesFiles: any[]
  attachedFiles: any[]
  status: evidenceStatus[]
  createdAt: string
  updatedAt: string
  transferenceSupport: TransferenceSupport
  deliverySupport: DeliverySupport
}

export interface CarModel {
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

export interface TransferenceSupport {}

export interface DeliverySupport {}
export interface IDateModal {
  id: string
}
export interface DeliveryDetail {
  id: string
  fileIds: string[]
  deliveryDate: string
  deliveryAddress: string
  comment: string
  status: string
  files: DeliveryDetailFile[]
}
export enum ChildSustentationStatus {
  Empty = 'EMPTY',
  Expired = 'EXPIRED',
  InReview = 'IN_REVIEW', // En revision
  Observed = 'OBSERVED', // Observado
  Confirmed = 'CONFIRMED', // Confirmado
}

export const childSustentationStatusRecord: Record<
  ChildSustentationStatus,
  { label: string; color: string; icon: string; iconClass: string }
> = {
  [ChildSustentationStatus.Empty]: {
    label: 'Vacío',
    color: 'brown',
    icon: 'Doc-Loupe',
    iconClass: 'text-[#a1a1a3]',
  },
  [ChildSustentationStatus.Expired]: {
    label: 'Expirado',
    color: 'orange',
    icon: 'Doc-Loupe',
    iconClass: 'text-[#a1a1a3]',
  },
  [ChildSustentationStatus.InReview]: {
    label: 'En revision',
    color: 'orange',
    icon: 'Doc-Loupe',
    iconClass: 'text-blue-500',
  },
  [ChildSustentationStatus.Observed]: {
    label: 'Observado',
    color: 'orange',
    icon: 'Doc-Loupe',
    iconClass: 'text-yellow-500',
  },
  [ChildSustentationStatus.Confirmed]: {
    label: 'Confirmado',
    color: 'green',
    icon: 'Doc-Loupe',
    iconClass: 'text-green-500',
  },
}

export interface SustentationDto {
  id: string
  bid?: BidDto
  bidId?: string
  payment?: PaymentDto
  paymentId?: string
  organization?: OrganizationDto
  offer?: OfferDto
  event?: EventDto
  transferenceSustentationId: string
}

export interface TransferenceSustentationDto {
  id: string
  sustentation: SustentationDto
  sustentationId: string
  participant: UserDto
  participantId: string
  soatFiles?: FileType[] | null
  identifierHolderFiles?: FileType[] | null
  identifierSpouseFiles?: FileType[] | null
  validityOfPowerFiles?: FileType[] | null
  rucCardFiles?: FileType[] | null
  status: ChildSustentationStatus
}

export type UploadTransferenceSustentationParamsDto = Pick<
  TransferenceSustentationDto,
  | 'id'
  | 'rucCardFiles'
  | 'soatFiles'
  | 'validityOfPowerFiles'
  | 'identifierHolderFiles'
  | 'identifierSpouseFiles'
>

export interface DeliveryDetailFile {
  id: string
  path: string
  createdAt: string
  updatedAt: string
  __entity: string
}

export enum evidenceStatus {
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
  Delivered = 'DELIVERED', // Enviado
  Concreted = 'CONCRETED', // Concreatedo
  // -----------------
  PendingOfDelivery = 'PENDING_OF_DELIVERY', // Pendiente de entrega
}
export enum DeliverySupportStatus {
  Approved = 'APPROVED', // Verde
  Observed = 'OBSERVED', // Amarillo
  Delivered = 'DELIVERED', // Azul
}
