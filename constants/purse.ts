import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import {
  TransactionHistoryMotive,
  transactionHistoryMotiveMap,
  TransactionHistoryType,
} from '~/types/TransactionHistory'

export const transactionHistorySearch: SearchItem[] = [
  {
    key: 'createdAt',
    type: 'date-range',
    label: 'Fecha de operación',
    placeholder: 'Inicio',
    width: 'w-auto',
  },
  {
    key: 'type',
    type: 'select',
    placeholder: 'Seleccionar',
    label: 'Tipo de Movimiento',
    items: [
      { text: 'Todos', value: ' ' },
      { text: 'Ingreso', value: TransactionHistoryType.Charge },
      { text: 'Egreso', value: TransactionHistoryType.Discharge },
    ],
    elementClass: 'min-w-[250px]',
  },
  {
    key: 'motive',
    type: 'select',
    placeholder: 'Seleccionar',
    label: 'Motivo',
    items: [
      { text: 'Todos', value: ' ' },
      {
        text: transactionHistoryMotiveMap[TransactionHistoryMotive.WalletTopUp]
          .label,
        value: TransactionHistoryMotive.WalletTopUp,
      },
      {
        text: transactionHistoryMotiveMap[
          TransactionHistoryMotive.BalanceWithdraw
        ].label,
        value: TransactionHistoryMotive.BalanceWithdraw,
      },
      {
        text: transactionHistoryMotiveMap[
          TransactionHistoryMotive.PenaltyDischarge
        ].label,
        value: TransactionHistoryMotive.PenaltyDischarge,
      },
    ],
    elementClass: 'min-w-[250px]',
  },
]
export const transactionHistoryHeader: HeaderItem[] = [
  {
    key: 'createdAt',
    label: 'Fecha de operación',
    sortable: true,
    align: 'center',
  },
  {
    key: 'type',
    label: 'Tipo de movimiento',
    sortable: true,
  },
  {
    key: 'motive',
    sortable: true,
    label: 'Motivo',
  },
  {
    key: 'currency',
    label: 'Moneda',
    sortable: true,
  },
  {
    key: 'amount',
    label: 'Monto',
    align: 'left',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'voucher',
    label: 'Comprobante',
    sortable: false,
  },
]
