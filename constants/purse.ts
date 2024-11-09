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
    position: 1,
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
    position: 2,
  },
  {
    key: 'createdAt',
    type: 'date',
    label: 'Fecha de operación',
    placeholder: 'Inicio',
    position: 3,
  },
  {
    key: '',
    type: 'date',
    label: '-',
    placeholder: 'Inicio',
    position: 4,
  },
]
export const transactionHistoryHeader: HeaderItem[] = [
  {
    key: 'createdAt',
    label: 'Fecha de operación',
    sortable: true,
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
    align: 'right',
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
