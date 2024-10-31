import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const bidStatus = new Map<string, { name: string; color: string }>([
  ['STARTED', { name: 'Iniciado', color: 'purple' }],
  ['DISCARDED', { name: 'Descartado', color: 'gray' }],
  ['REJECTED', { name: 'Rechazado', color: 'blue' }],
  ['DEBATED', { name: 'Debatido', color: 'blue' }],
  ['ACCEPTED', { name: 'Aceptado', color: 'blue' }],
  ['WINNER', { name: 'Ganador', color: 'green' }],
])

export const bidsSearch: SearchItem[] = [
  {
    key: 'title',
    type: 'text',
    placeholder: 'Buscar oferta',
    elementClass: 'min-w-[400px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    items: [
      ...Array.from(bidStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const bidsHeader: HeaderItem[] = [
  {
    key: 'code',
    label: 'Código',
    sortable: true,
  },
  {
    key: 'offer.title',
    label: 'Bien',
    sortable: true,
  },
  {
    key: 'date',
    sortable: true,
    label: 'Fecha y hora',
  },
  {
    key: 'amount',
    label: 'Monto',
    sortable: true,
  },
  {
    key: 'offer.appraisal',
    label: 'Tasación',
    align: 'right',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'actions',
    label: '',
    sortable: false,
    align: 'center',
  },
]
