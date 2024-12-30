import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const bidStatus = new Map<string, { name: string; color: string }>([
  ['STARTED', { name: 'Iniciado', color: 'purple' }],
  ['DISCARDED', { name: 'Descartado', color: 'brown' }],
  ['REJECTED', { name: 'Rechazado', color: 'red' }],
  ['DEBATED', { name: 'Debatido', color: 'blue' }],
  ['RESERVED', { name: 'Reservada', color: 'blue' }],
  ['ACCEPTED', { name: 'Aceptado', color: 'blue' }],
  ['WINNER', { name: 'Ganador', color: 'green' }],
  ['BASE', { name: 'Base', color: 'blue' }],
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
    key: 'createdAt',
    sortable: true,
    label: 'Fecha y hora',
  },
  {
    key: 'pseudonym',
    sortable: false,
    label: 'Pseudónimo',
  },
  {
    key: 'offer.title',
    label: 'Bien',
    sortable: true,
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
export const bidsParticipantSearch: SearchItem[] = [
  {
    key: 'title',
    type: 'text',
    placeholder: 'Buscar titulo oferta',
    elementClass: 'min-w-[400px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Estado',
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

export const bidsParticipantHeader: HeaderItem[] = [
  {
    key: 'offer.event.name',
    label: 'Evento',
    sortable: true,
  },
  {
    key: 'offer.title',
    label: 'Titulo de oferta',
    sortable: true,
  },
  {
    key: 'offerEndTime',
    sortable: true,
    label: 'Fec. cierre oferta',
  },
  {
    key: 'eventGoodType',
    label: 'Tipo de activo',
    sortable: true,
  },
  {
    key: 'amount',
    sortable: true,
    label: 'Valor de Puja',
  },
  {
    key: 'taxes',
    label: 'Comisión',
    sortable: true,
  },
  {
    key: 'total',
    label: 'Total',
    align: 'right',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado abono',
    sortable: true,
  },
  {
    key: 'documents',
    label: 'D. Sustento de abono',
    sortable: false,
  },
  {
    key: 'transferenceSustentation',
    label: 'D. Sustento de Transferencia',
    sortable: false,
  },

  {
    key: 'actions',
    label: 'Acción',
    sortable: false,
    align: 'center',
  },
]
