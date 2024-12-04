import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
export const rechargeStatus = new Map<string, { name: string; color: string }>([
  ['PENDING', { name: 'Pendiente', color: 'orange' }],
  ['REJECTED', { name: 'Rechazado', color: 'red' }],
  ['APPROVED', { name: 'Aprobado', color: 'blue' }],
])
export const disbursementStatus = new Map<string,{ name: string; color: string }>([
  ['PENDING', { name: 'Pendiente', color: 'orange' }],
  ['CONFIRMED_DEPOSIT', { name: 'Deposito confirmado', color: 'blue' }],
  ['ANNULED_DEPOSIT', { name: 'Deposito anulado', color: 'red' }],
])
export const accountStatus = new Map<string, { name: string; color: string }>([
  ['PENDING', { name: 'Pendiente', color: 'orange' }],
  ['REJECTED', { name: 'Rechazado', color: 'red' }],
  ['APPROVED', { name: 'Aprobado', color: 'blue' }],
]);

export const bankType = new Map<string, string>([
  ['BBVA', 'BBVA'],
  ['BCP', 'Bcp'],
  ['SCOTIABANK', 'Scotiabank'],
])
export const paymentMethodType = new Map<string, string>([
  ['TRANSFERENCE', 'Transferencia'],
])
export const currencyType = new Map<string, string>([['USD', 'USD']])
export const paymentMediumType = new Map<string, string>([
  ['ACCOUNT_DEPOSIT', 'Depósito en cuenta'],
])
export const accountType = new Map<string, string>([
  ['SAVINGS', 'Cuenta de ahorros'],
  ['CURRENT_ACCOUNT', 'Cuenta corriente'],
])
export const rejectionReasonType = new Map<string, string>([
  ['NOT_ACCOUNT_HOLDER', 'No es titular de la cuenta'],
  ['INVALID_ACCOUNT_NUMBER', 'Número de cuenta inválido'],
  ['CLOSED_ACCOUNT', 'Cuenta cerrada'],
  ['OTHER', 'Otros'],
])
export const rechargeSearch: SearchItem[] = [
  {
    key: 'id',
    type: 'text',
    placeholder: 'Buscar cliente, operación o transacción',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
  },
  {
    key: 'transferedAt',
    type: 'date-range',
    placeholder: 'Fecha de transferencia',
    width: 'w-auto',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de solicitud',
    width: 'w-auto',
  },
]
export const accountSearch: SearchItem[] = [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar n° de transacción o participante',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de solicitud',
    width: 'w-auto',
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
  },
]
export const withdrawalRequestsSearch: SearchItem[] = [
  {
    key: 'id',
    type: 'text',
    placeholder: 'Buscar cliente, operación o transacción',
    width: 'max-w-xs w-full',
    elementClass: 'w-full',
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Fecha de transferencia',
    width: 'w-auto',
  },
  {
    key: 'transferedAt',
    type: 'date-range',
    placeholder: 'Fecha de solicitud',
    width: 'w-auto',
  },
]
export const disbursementSearch: SearchItem[] = [
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
  },
  {
    key: 'transfer',
    type: 'date',
    placeholder: 'Fecha de transferencia',
    position: 2,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    items: [
      ...Array.from(disbursementStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const rechargeHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transación',
  },
  {
    key: 'updatedAt',
    label: 'Fec. Solicitud',
  },
  {
    key: 'fullName',
    label: 'Nombres y apellidos',
  },
  {
    key: 'operationNumber',
    label: 'N° Operación',
  },
  {
    key: 'transferedAt',
    label: 'Fec. Transferencia',
  },
  {
    key: 'amount',
    label: 'Importe',
  },
  {
    key: 'livelihood',
    label: 'Sustento',
    align: 'center',
  },
  {
    key: 'status',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
export const accountHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transación',
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
    key: 'bank',
    label: 'Banco',
    sortable: true,
  },
  {
    key: 'currency',
    label: 'Moneda',
  },
  {
    key: 'destinationAccountNumber',
    label: 'N° de cueta destino',
  },
  {
    key: 'status',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
export const withdrawalRequeststHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N° Transación',
  },
  {
    key: 'createdAt',
    label: 'Fec. Solicitud',
  },
  {
    key: 'participant.commonName',
    label: 'Nombres y apellidos',
  },
  {
    key: 'createdAt',
    label: 'Fec. Transferencia',
  },
  {
    key: 'amount',
    label: 'Importe',
  },
  // {
  //   key: 'livelihood',
  //   label: 'Sustento',
  //   align: 'center',
  // },
  {
    key: 'status',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: '',
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
    key: 'withdrawalRequestCount',
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
    key: 'status',
    label: 'Estado',
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
