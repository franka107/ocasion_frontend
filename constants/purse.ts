import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const purseSearch: SearchItem[] = [
  {
    key: 'typeOfMovement',
    type: 'select',
    placeholder: 'Seleccionar',
    label: 'Tipo de Movimiento',
    items: [{ text: 'Todos', value: ' ' }],
    elementClass: 'min-w-[250px]',
    position: 1,
  },
  {
    key: 'motive',
    type: 'select',
    placeholder: 'Seleccionar',
    label: 'Motivo',
    items: [{ text: 'Todos', value: ' ' }],
    elementClass: 'min-w-[250px]',
    position: 2,
  },
  {
    key: '',
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
