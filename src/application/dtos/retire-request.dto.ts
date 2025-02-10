import type { Currency } from '~/src/domain/types/currency'
import type { Bank } from '~/types/Disbursement'

export type RetireRequest = {
  id: string
  participant: {
    id: string
    commonName: string
    documentIdentifier: string
    documentType: string
  }
  transactionHistory?: unknown
  accountValidation?: unknown
  amount: number
  currency: Currency
  bank: Bank
  destinationAccount: string
  destinationCCI: string
  accountType: AccountType
  operationType: OperationType
  status: RequestStatus
  disbursementLot?: {
    id: string
    disbursedAt?: Date | null
    platformEmail?: string
  } | null
  createdAt: Date
  acceptedTermsAndConditions: boolean
  rejectionReason?: RejectionReason | null
  rejectionDetails?: string | null
}
