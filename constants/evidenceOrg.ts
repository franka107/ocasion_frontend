import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const evidenceStatus = new Map<string, { name: string; color: string }>([
  ['CREATED', { name: 'Nuevo', color: 'purple' }], // Nuevo
  ['DEBATED', { name: 'Debatido', color: 'orange' }], // Debatido
  ['CONFIRMED', { name: 'Confirmado', color: 'green' }], // Confirmado
  ['RETIRED', { name: 'Retirado', color: 'red' }], // Retirado
  ['IN_PROGRESS', { name: 'En curso', color: 'purple' }], // En curso (usando color de 'Nuevo')
  ['CANCELLED', { name: 'Cancelado', color: 'brown' }], // Cancelado
  ['IN_REVIEW', { name: 'En revisión', color: 'orange' }], // En revisión (usando color de 'Debatido')
  ['REJECTED', { name: 'Rechazado', color: 'red' }], // Rechazado
  ['IN_DEPOSIT_REVIEW', { name: 'En revisión de depósito', color: 'red' }], // Rechazado (similar)
  ['PENDING_DEPOSIT', { name: 'Abono pendiente', color: 'blue' }], // Abono pendiente (usando color de 'Pendiente de pago')
  ['OBSERVED_DEPOSIT', { name: 'Abono observado', color: 'orange' }], // Abono observado (similar a 'Debatido')
  ['CONFIRMED_DEPOSIT', { name: 'Depósito confirmado', color: 'green' }], // Depósito confirmado (usando color de 'Confirmado')

  ['DEBATED_BID', { name: 'Puja debatida', color: 'orange' }], // Puja debatida PSD-63
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
export const transferSupportIcons = new Map<
  string,
  { icon: string; class: string }
>([
  ['APPROVED', { icon: 'Doc-Transfer', class: 'text-green' }], // Aprobado
  ['OBSERVED', { icon: 'Doc-Transfer', class: 'text-yellow' }], // Observado
  ['DELIVERED', { icon: 'Doc-Transfer', class: 'text-blue' }], // Entregado
])

export const evidenceSearch: SearchItem[] = [
  {
    key: 'title',
    type: 'text',
    placeholder: 'Buscar sustento',
    elementClass: 'min-w-[400px]',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    items: [
      ...Array.from(evidenceStatus).map(([key, value]) => ({
        text: value.name,
        value: key,
      })),
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]

export const evidenceHeader: HeaderItem[] = [
  {
    key: 'title',
    label: 'Titulo oferta',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Descripción',
    sortable: true,
  },
  {
    key: 'Category of the good',
    sortable: true,
    label: 'Categoría del bien',
  },
  {
    key: 'Subcategory of the good',
    label: 'Sub Categoría del bien',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado abono',
    sortable: true,
  },
  {
    key: 'SupportForTransfer',
    label: 'S. de Transferencia',
    align: 'center',
    sortable: true,
  },
  {
    key: 'SupportForDelivery',
    label: 'S. de Entrega',
    align: 'center',
    sortable: true,
  },
]
