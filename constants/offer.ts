import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const offerStatus = new Map<string, { name: string; color: string }>([
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
  [
    'IN_TRANSFER_OF_GOOD',
    { name: 'En transferencia de bienes', color: 'purple' },
  ], // En transferencia de bienes (similar a 'Nuevo')
  ['DELIVERED', { name: 'Entregado', color: 'green' }], // Entregado (similar a 'Confirmado')
  ['CONCRETED', { name: 'Concretado', color: 'green' }], // Concretado (similar a 'Confirmado')
])

export const offerSearch: SearchItem[] = [
  {
    key: 'title',
    type: 'text',
    placeholder: 'Buscar oferta',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const offerHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N°',
    sortable: true,
  },
  {
    key: 'title',
    label: 'Bien',
    sortable: true,
  },
  {
    key: 'brandName',
    sortable: true,
    label: 'Marca',
  },
  {
    key: 'modelName',
    label: 'Modelo',
    sortable: true,
  },
  {
    key: 'year',
    label: 'Año',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'attachedFiles',
    label: 'Fotos',
    sortable: true,
  },
  {
    key: 'addressCity',
    label: 'Ubicación',
    sortable: true,
  },
  {
    key: 'appraisal',
    label: 'Tasación',
    align: 'right',
    sortable: true,
  },
  {
    key: 'initialValue',
    label: 'Valor inicial',
    align: 'right',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
