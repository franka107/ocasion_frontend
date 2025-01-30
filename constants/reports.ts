import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import {
  TransactionHistoryMotive,
  transactionHistoryMotiveMap,
} from '~/types/TransactionHistory'

export const transactionsStatus = new Map<
  string,
  { name: string; color: string }
>([
  ['AUTHORIZED', { name: 'Autorizado', color: 'blue' }],
  ['REJECTED', { name: 'Rechazado', color: 'red' }],
  ['PENDING', { name: 'Pendiente', color: 'brown' }],
])
export const disbursementStatus = new Map<
  string,
  { name: string; color: string }
>([
  ['PENDING', { name: 'Pendiente', color: 'orange' }],
  ['CONFIRMED_DEPOSIT', { name: 'Deposito confirmado', color: 'blue' }],
  ['ANNULED_DEPOSIT', { name: 'Deposito anulado', color: 'red' }],
])
export const validationStatus = new Map<
  string,
  { name: string; color: string }
>([
  ['PENDING', { name: 'Pendiente', color: 'orange' }],
  ['REJECTED', { name: 'Rechazado', color: 'red' }],
  ['APPROVED', { name: 'Aprobado', color: 'blue' }],
])
export const bankType = new Map<string, string>([
  ['BBVA', 'BBVA'],
  ['BCP', 'Bcp'],
  ['SCOTIABANK', 'Scotiabank'],
])
export const transactionsSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
    label: 'Buscar Participante, N° transacción o operación ',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de operación',
    width: 'w-auto',
    label: 'Fecha de operación',
  },
  {
    key: 'status',
    type: 'select',
    items: [
      ...Array.from(transactionsStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    placeholder: 'Estado',
    label: 'Buscar por estado',
  },
  {
    key: 'motive',
    type: 'select',
    items: [
      ...Object.keys(transactionHistoryMotiveMap).map((key) => ({
        text: transactionHistoryMotiveMap[key as TransactionHistoryMotive]
          .label,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    isHidden: true,
    placeholder: 'Tipo de operación',
    label: 'Buscar por tipo de operación',
  },
]

export const transactionsParticipantSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar cliente, evento o n° de transacción',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Periodo de transacción',
    width: 'w-auto',
  },
  {
    key: 'motive',
    type: 'select',
    items: [
      ...Object.keys(transactionHistoryMotiveMap).map((key) => ({
        text: transactionHistoryMotiveMap[key as TransactionHistoryMotive]
          .label,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    placeholder: 'Tipo de operación',
  },
  {
    key: 'status',
    type: 'select',
    items: [
      ...Array.from(transactionsStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    isHidden: true,
    placeholder: 'Estado',
  },
]

export const disbursementSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar ',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
    label: 'Buscar participante, n° transacción o  n° DOI',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de registro',
    width: 'w-auto',
    label: 'Fecha de registro',
  },
  {
    key: 'bank',
    type: 'select',
    placeholder: 'Banco',
    items: [
      ...Array.from(bankType).map(([key, value]) => ({
        text: value,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 3,
    label: 'Buscar por banco',
  },
  {
    key: 'status',
    type: 'select',
    items: [
      ...Array.from(disbursementStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    isHidden: true,
    placeholder: 'Estado',
    label: 'Buscar por estado',
  },
]
export const validationSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
    label: 'Buscar participante, n° transacción o  n° DOI',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de solicitud',
    width: 'w-auto',
    label: 'Fecha de solicitud',
  },
  {
    key: 'status',
    type: 'select',
    items: [
      ...Array.from(validationStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    isHidden: true,
    placeholder: 'Estado',
    label: 'Buscar por estado',
  },
  {
    key: 'bank',
    type: 'select',
    items: [
      ...Array.from(bankType).map(([key, value]) => ({
        text: value,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    isHidden: true,
    placeholder: 'Banco',
    label: 'Buscar por banco',
  },
]
export const balanceSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar participante, documento',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
    label: 'Buscar por participante o documento',
  },
  {
    key: 'quickSearchPeriod',
    type: 'text',
    placeholder: 'Periodo',
    width: 'w-auto',
    label: 'Buscar por periodo',
  },
]

export const transactionsHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transacción',
  },
  {
    key: 'operationId',
    label: 'N° Operación',
  },
  {
    key: 'fullName',
    label: 'Nombres y apellidos',
  },
  {
    key: 'document',
    label: 'Documento',
  },
  {
    key: 'motive',
    label: 'Tipo de operación',
    sortable: true,
  },
  {
    key: 'dateOfOperation',
    label: 'Fecha de operación',
  },
  {
    key: 'amount',
    label: 'Monto',
  },
  {
    key: 'livelihood',
    label: 'Sustento',
    align: 'center',
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
export const disbursementHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'Cod lote',
  },
  {
    key: 'retireRequestsCount',
    label: 'Cant. solicitud retiro',
  },
  {
    key: 'createdAt',
    label: 'Fec. Registro',
  },
  {
    key: 'totalAmount',
    label: 'Monto a  desembolsar',
    sortable: true,
  },
  {
    key: 'bank',
    label: 'Banco',
    sortable: true,
  },
  {
    key: 'archive',
    label: 'Archivo',
    align: 'center',
  },
  {
    key: 'proofOfDisbursement',
    label: 'Comprobante desembolso',
    align: 'center',
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
]
export const validationHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transacción',
  },
  {
    key: 'createdAt',
    label: 'Fec. Solicitud',
  },
  {
    key: 'fullName',
    label: 'Nombres y apellidos',
  },
  {
    key: 'document',
    label: 'Documento',
  },
  {
    key: 'bank',
    label: 'Banco',
    sortable: true,
  },
  {
    key: 'currency',
    label: 'Moneda',
  },
  {
    key: 'transactionNumber',
    label: 'N° de cueta',
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
]

export const balanceHeader: HeaderItem[] = [
  {
    key: 'fullName',
    label: 'Nombres y apellidos',
  },
  {
    key: 'chargeBalance',
    label: 'Ingresos',
  },
  {
    key: 'dischargeBalance',
    label: 'Egresos',
  },
  {
    key: 'penaltyBalance',
    label: 'Penalidades',
  },
  {
    key: 'guaranteedBalance',
    label: 'Garantizada',
  },
  {
    key: 'availableBalance',
    label: 'Saldo',
  },
  {
    key: 'pendingWithdrawalBalance',
    label: 'Retiro pendiente',
  },
  {
    key: 'pendingRechargeBalance',
    label: 'Recarga pendiente',
  },
]
export const transactionsParticipantHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transación',
  },
  {
    key: 'motive',
    label: 'Tipo de operación',
    sortable: true,
  },
  {
    key: 'createdAt',
    label: 'Fecha de operación',
    sortable: true,
  },
  {
    key: 'amount',
    label: 'Monto',
  },
  {
    key: 'livelihood',
    label: 'Sustento',
    align: 'center',
  },
  {
    key: 'voucher',
    label: 'Comprobante',
    align: 'center',
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
]
