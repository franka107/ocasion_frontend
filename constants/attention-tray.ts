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
export const rechargeSearch: SearchItem[] = [
  {
    key: 'id',
    type: 'text',
    placeholder: 'Buscar cliente, operación o transacción',
    elementClass: 'max-w-[700px] w-full',
    position: 1,
  },
  {
    key: 'name',
    type: 'text',
    placeholder: 'Fecha de transferencia',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
  {
    key: 'name',
    type: 'text',
    placeholder: 'Fecha de solicitud',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const accountSearch: SearchItem[] = [
  {
    key: 'id',
    type: 'text',
    placeholder: 'Buscar n° de transacción o participante',
    elementClass: 'max-w-[700px] w-full',
    position: 1,
  },
  {
    key: 'name',
    type: 'text',
    placeholder: 'Fecha de solicitud',
    elementClass: 'min-w-[400px]',
    position: 2,
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
  },
]
export const withdrawalRequestsSearch: SearchItem[] = [
  {
    key: 'id',
    type: 'text',
    placeholder: 'Buscar cliente, operación o transacción',
    elementClass: 'max-w-[700px] w-full',
    position: 1,
  },
  {
    key: 'name',
    type: 'text',
    placeholder: 'Fecha de transferencia',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
  {
    key: 'name',
    type: 'text',
    placeholder: 'Fecha de solicitud',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const disbursementSearch: SearchItem[] = [
  {
    key: 'bank',
    type: 'text',
    placeholder: 'Buscar banco',
    elementClass: 'max-w-[700px] w-full',
    position: 1,
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
    key: 'transactionNumber',
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
