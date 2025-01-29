import { record } from 'zod'
import type { UserDto } from './Administrators'
import type { Color } from '~/constants/ui'

export enum TransactionHistoryStatus {
  Authorized = 'AUTHORIZED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export enum TransactionHistoryCurrency {
  USD = 'USD',
}

export enum TransactionHistoryType {
  Charge = 'CHARGE',
  Discharge = 'DISCHARGE',
}

export enum TransactionHistoryMotive {
  WalletTopUp = 'WALLET_TOP_UP', // Recarga de monedero
  PenaltyDischarge = 'PENALTY_DISCHARGE', // Cobro de penalidad
  BalanceWithdraw = 'BALANCE_WITHDRAW', // Retirod de saldo
  GuaranteeSeparation = 'GUARANTEE_SEPERATION', // Separacion de garantia (Experimental)
}

export interface TransactionHistoryDto {
  id: string
  user: UserDto
  userId: string
  amount: number
  createdAt: Date
  status: TransactionHistoryStatus
  currency: TransactionHistoryCurrency
  type: TransactionHistoryType
  motive: TransactionHistoryMotive
}

export const transactionHistoryStatusMap: Record<
  TransactionHistoryStatus,
  { label: string; color: string }
> = {
  [TransactionHistoryStatus.Rejected]: {
    label: 'Rechazado',
    color: 'red',
  },
  [TransactionHistoryStatus.Authorized]: {
    label: 'Autorizado',
    color: 'green',
  },
  [TransactionHistoryStatus.Pending]: {
    label: 'Pendiente',
    color: 'brown',
  },
}

export const transactionHistoryTypeMap: Record<
  TransactionHistoryType,
  { label: string; color: Color }
> = {
  [TransactionHistoryType.Charge]: {
    label: 'Ingreso',
    color: 'green',
  },
  [TransactionHistoryType.Discharge]: {
    label: 'Egreso',
    color: 'red',
  },
}

export const transactionHistoryCurrencyMap: Record<
  TransactionHistoryCurrency,
  { label: string }
> = {
  [TransactionHistoryCurrency.USD]: {
    label: 'USD',
  },
}

export const transactionHistoryMotiveMap: Record<
  TransactionHistoryMotive,
  { label: string }
> = {
  [TransactionHistoryMotive.WalletTopUp]: {
    label: 'Recarga de saldo',
  },
  [TransactionHistoryMotive.PenaltyDischarge]: {
    label: 'Cobro de penalidad',
  },
  [TransactionHistoryMotive.BalanceWithdraw]: {
    label: 'Retiro de saldo',
  },
  [TransactionHistoryMotive.GuaranteeSeparation]: {
    label: 'Separación de garantía',
  },
}

export interface TransactionHistoryListItem {
  id: string
  amount: number
  createdAt: string
  status: TransactionHistoryStatus
  currency: string
  type: string
  motive: string
  wallet: Wallet
  walletId: string
}

export interface Wallet {
  id: string
  availableBalance: number
  guaranteedBalance: number
  createdAt: string
  user: UserDto
  userId: string
}
