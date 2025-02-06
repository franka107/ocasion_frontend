import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import { GlobalType } from '~/types/Common'
import type { PaymentStatus } from '~/types/Payment'

export const paymentStatus = new Map<string, { name: string; color: string }>([
  ['BASE', { name: 'Inicial', color: 'brown' }],
  ['OBSERVED', { name: 'Abono observado', color: 'orange' }],
  ['IN_REVIEW', { name: 'En revisión de abono', color: 'blue' }],
  ['CONFIRMED', { name: 'Abono confirmado', color: 'green' }],
  ['CANCELLED', { name: 'Cancelada', color: 'red' }],
  ['CONCRETED', { name: 'Concretada', color: 'brown' }],
])

export const paymentsSearch = (globalType: GlobalType): SearchItem[] => [
  {
    key: 'quickSearch',
    type: 'text',
    label: 'Búsqueda rápida',
    placeholder:
      globalType === GlobalType.Platform
        ? 'Buscar por Org./Cód./Tít. Oferta'
        : 'Buscar por Cód./Tít. Oferta',
    elementClass: 'min-w-[500px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    label: 'Estados',
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
    key: 'offerId',
    label: 'Cód. Oferta',
    sortable: false,
  },
  {
    key: 'offer.title',
    label: 'Título de oferta',
    sortable: false,
  },
  {
    key: 'event',
    label: 'Evento',
    sortable: false,
  },
  {
    key: 'bid',
    label: 'Puja',
    sortable: false,
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
  ...(viewType === 'platform'
    ? [
        {
          key: 'comissionAmount',
          label: 'Monto de comisión',
          sortable: true,
        },
        {
          key: 'propertyAmount',
          label: 'Monto de propiedad',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Estado general de abono',
          sortable: true,
        },
      ]
    : []),

  ...(viewType === 'organization'
    ? [
        {
          key: 'propertyAmount',
          label: 'Monto de propiedad',
          sortable: true,
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
  // {
  //   key: 'compostPropertyPaymentStatus',
  //   label: 'Estado de sustento de pago (propiedad)',
  //   sortable: true,
  // },
  //
  // {
  //   key: 'compostComissionPaymentStatus',
  //   label: 'Estado de sustento de pago (comisión)',
  //   sortable: true,
  // },

  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
