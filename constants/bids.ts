import { goodType } from './events'
import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const bidStatus = new Map<string, { name: string; color: string }>([
  ['STARTED', { name: 'Puja Iniciada', color: 'purple' }],
  ['DISCARDED', { name: 'Puja Descartada', color: 'brown' }],
  ['REJECTED', { name: 'Puja Rechazada', color: 'red' }],
  ['CANCELLED', { name: 'Puja Cancelada', color: 'red' }],
  ['DEBATED', { name: 'Puja Debatida', color: 'orange' }],
  ['RESERVED', { name: 'Puja Reservada', color: 'blue' }],
  ['ACCEPTED', { name: 'Puja Aceptada', color: 'purple' }],
  ['WINNER', { name: 'Puja Ganadora', color: 'green' }],
  ['BASE', { name: 'Puja Base', color: 'brown' }],
])

export const bidsSearch = (offerId?: string | null): SearchItem[] => [
  ...(!offerId
    ? ([
        {
          key: 'title',
          type: 'text',
          placeholder: 'Buscar oferta',
          elementClass: 'min-w-[400px]',
          position: 1,
        },
      ] as SearchItem[])
    : []),

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
    key: 'offerId',
    label: 'Código',
    align: 'center',
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
    key: 'offerAppraisal',
    realKey: 'offer.appraisal',
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
    placeholder: 'Buscar',
    label: 'Titulo de oferta',
    elementClass: 'min-w-[400px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Estado',
    label: 'Estado',
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
  {
    key: 'eventGoodType',
    type: 'select',
    label: 'Tipo de activo',
    placeholder: 'Tipo de activo',
    items: [
      ...Array.from(goodType).map(([key, value]) => ({
        text: value,
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
    label: 'Título de oferta',
    sortable: true,
  },
  {
    key: 'offerEndTime',
    realKey: 'offer.endTime',
    sortable: true,
    label: 'Fec. cierre oferta',
  },
  {
    key: 'eventGoodType',
    realKey: 'event.goodType',
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
    align: 'center',
    sortable: false,
  },
  {
    key: 'total',
    label: 'Total',
    align: 'center',
    sortable: false,
  },
  // {
  //   key: 'offerStatus',
  //   label: 'E. de oferta',
  //   sortable: true,
  // },
  {
    key: 'status',
    label: 'E. de puja',
    sortable: true,
  },
  {
    key: 'payment',
    label: 'D. Sustento de abono',
    align: 'center',
    sortable: false,
  },
  {
    key: 'transferenceSustentation',
    label: 'D. Sustento de Transferencia',
    sortable: false,
  },
  {
    key: 'deliverySustentation',
    label: 'D. Sustento de entrega ',
    sortable: false,
  },

  {
    key: 'actions',
    label: 'Acción',
    sortable: false,
    align: 'center',
  },
]
