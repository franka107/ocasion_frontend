import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const paymentStatus = new Map<string, { name: string; color: string }>([
  ['BASE', { name: 'Base', color: 'brown' }],
  ['OBSERVED', { name: 'Abono observado', color: 'orange' }],
  ['IN_REVIEW', { name: 'En revisión de abono', color: 'blue' }],
  ['CONFIRMED', { name: 'Abono confirmado', color: 'green' }],
  ['CANCELLED', { name: 'Cancelada', color: 'red' }],
  ['CONCRETED', { name: 'Concretada', color: 'brown' }],
])
export const paymentsSearch: SearchItem[] = [
  {
    key: 'organization',
    type: 'text',
    placeholder: 'Buscar organización',
    elementClass: 'min-w-[400px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    items: [
      ...Array.from(paymentStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const paymentsHeader = (viewType: ViewType): HeaderItem[] => [
  {
    key: 'offer.id',
    label: 'Cód. Oferta',
    sortable: true,
  },
  {
    key: 'event',
    label: 'Evento',
    sortable: true,
  },
  ...(viewType === 'platform'
    ? [
        {
          key: 'organization.name',
          label: 'Organización',
          sortable: true,
        },
      ]
    : []),
  ...(viewType === 'platform'
    ? [
        {
          key: 'compostComissionPaymentFile',
          label: 'Sustento pago de comisión',
          sortable: false,
        },
      ]
    : []),

  ...(viewType === 'organization'
    ? [
        {
          key: 'compostPropertyPaymentFile',
          label: 'Sustento pago de propiedad',
          sortable: false,
        },
      ]
    : []),

  {
    key: 'date',
    label: 'Fecha de envio',
    sortable: true,
  },
  {
    key: 'propertyAmount',
    label: 'Monto de sustento',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado abono',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
