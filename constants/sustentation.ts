import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import { GlobalType } from '~/types/Common'

export const evidencePlatfStatus = new Map<
  string,
  { name: string; color: string }
>([
  ['CREATED', { name: 'Nuevo', color: 'purple' }], // Nuevo
  ['DEBATED', { name: 'Debatido', color: 'orange' }], // Debatido
  ['CONFIRMED', { name: 'Confirmado', color: 'green' }], // Confirmado
  ['RETIRED', { name: 'Retirado', color: 'red' }], // Retirado
  ['IN_PROGRESS', { name: 'En curso', color: 'purple' }], // En curso (usando color de 'Nuevo')
  ['CANCELLED', { name: 'Cancelado', color: 'brown' }], // Cancelado
  ['IN_REVIEW', { name: 'En revisión', color: 'orange' }], // En revisión (usando color de 'Debatido')
  ['DEBATED_BID', { name: 'Puja debatida', color: 'red' }], // Puja debatida PSD-63
  ['REJECTED', { name: 'Rechazado', color: 'red' }], // Rechazado
  ['IN_DEPOSIT_REVIEW', { name: 'En revisión de depósito', color: 'red' }], // Rechazado (similar)
  ['PENDING_DEPOSIT', { name: 'Abono pendiente', color: 'blue' }], // Abono pendiente (usando color de 'Pendiente de pago')
  ['OBSERVED_DEPOSIT', { name: 'Abono observado', color: 'orange' }], // Abono observado (similar a 'Debatido')
  ['CONFIRMED_DEPOSIT', { name: 'Depósito confirmado', color: 'green' }], // Depósito confirmado (usando color de 'Confirmado')
  [
    'IN_TRANSFER_OF_GOOD',
    { name: 'En transferencia de bienes', color: 'purple' },
  ], // En transferencia de bienes (similar a 'Nuevo')
  ['DELIVERED', { name: 'Entregado', color: 'green' }], // Entregado (similar a 'Confirmado')
  ['CONCRETED', { name: 'Concretado', color: 'green' }], // Concretado (similar a 'Confirmado')
])

export const deliverySupportIcons = new Map<
  string,
  { icon: string; class: string }
>([
  ['APPROVED', { icon: 'Doc-Loupe', class: 'text-green' }], // Aprobado
  ['OBSERVED', { icon: 'Doc-Loupe', class: 'text-yellow' }], // Observado
  ['DELIVERED', { icon: 'Doc-Loupe', class: 'text-blue' }], // Entregado
])

export const evidencePlatfSearch = (globalType: GlobalType): SearchItem[] => [
  {
    key: 'quickSearch',
    type: 'text',
    label: 'Búsqueda rápida',
    placeholder:
      globalType === GlobalType.Platform
        ? 'Org o Cód/Tít de Oferta'
        : 'Cód/Tít de Oferta',
    elementClass: 'min-w-[500px]',
    position: 1,
  },
  // {
  //   key: 'status',
  //   type: 'select',
  //   placeholder: 'Filtrar estados',
  //   items: [
  //     ...Array.from(evidencePlatfStatus).map(([key, value]) => ({
  //       text: value.name,
  //       value: key,
  //     })),
  //     { text: 'Todos', value: ' ' },
  //   ],
  //   elementClass: 'min-w-[400px]',
  //   position: 2,
  // },
]

// Título de oferta
//
// Descripción
//
// Categoría del bien
//
// Sub categoría del bien
//
// Estado
//
// Sustentos de Transferencia (Documentos cargados. Vista solo para
// Organización
// )
//
// Sustentos de Entrega (Documentos cargados. vista para
// organización
// y
// plataforma
// )

export const sustentationHeaderList = (viewType: GlobalType): HeaderItem[] => [
  ...(viewType === GlobalType.Platform
    ? [
        {
          key: 'organization.name',
          label: 'Organización',
          sortable: true,
        },
      ]
    : []),

  {
    key: 'offerId',
    label: 'Cod. oferta',
    align: 'center',
    sortable: false,
  },
  {
    key: 'offer.title',
    label: 'Título oferta',
    sortable: false,
  },

  {
    key: 'offer.description',
    label: 'Descripción',
    sortable: false,
  },
  {
    key: 'eventGoodType',
    sortable: false,
    label: 'Categoría del bien',
  },
  {
    key: 'offer.carBrand.name',
    label: 'Sub Categoría del bien',
    sortable: false,
  },
  {
    key: 'createdAt',
    label: 'Fecha de evidencia',
    align: 'center',
    sortable: true,
  },
  // {
  //   key: 'paymentStatus',
  //   label: 'Estado abono',
  //   sortable: true,
  // },
  ...(viewType === GlobalType.Platform
    ? ([
        {
          key: 'transferenceSustentationUpdatedAt',
          label: 'F. de actualización S. de transferencia',
          align: 'center',

          sortable: false,
        },
        {
          key: 'transferenceSustentation',
          label: 'S. de transferencia',
          align: 'center',

          sortable: false,
        },
        {
          key: 'deliverySustentationUpdatedAt',
          label: 'F. de actualización S. de entrega',
          align: 'center',
          sortable: false,
        },
        {
          key: 'deliverySustentation',
          label: 'S. de entrega',
          // align: 'center',
          sortable: true,
        },
      ] as HeaderItem[])
    : []),
  ...(viewType === GlobalType.Organization
    ? ([
        {
          key: 'transferenceSustentationUpdatedAt',
          label: 'F. de actualización S. de transferencia',
          align: 'center',
          sortable: false,
        },
        {
          key: 'transferenceSustentation',
          label: 'S. de transferencia',
          align: 'center',
          sortable: false,
        },
        {
          key: 'deliverySustentationUpdatedAt',
          label: 'F. de actualización S. de entrega',
          align: 'center',
          sortable: false,
        },
        {
          key: 'deliverySustentation',
          label: 'S. de entrega',
          // align: 'center',
          sortable: true,
        },
      ] as HeaderItem[])
    : []),
]
