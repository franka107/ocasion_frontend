import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const userType = new Map<string, string>([
  ['PLATFORM_ADMIN', 'Administrador de plataforma'],
  ['PLATFORM_USER', 'Usuario plataforma'],
  ['ORGANIZATION_ADMIN', 'Administrador de organizacion'],
  ['SUPER_ADMIN', 'Super Administrador'],
  ['ORGANIZATION_USER', 'Usuario de organizacion'],
])

export const participantSearch = (): SearchItem[] => [
  {
    key: 'quickSearch',
    type: 'text',
    placeholder: 'Buscar por Nombre, Razón Social, Email, Teléfono o Documento',
    label: 'Busqueda rápida',
    position: 1,
  },

  {
    key: 'status',
    type: 'select-multiple',
    placeholder: 'Estados',
    items: [
      { text: 'Activo', value: 'ACTIVE' },
      { text: 'Suspendido', value: 'SUSPENDED' },
      { text: 'Bloqueado', value: 'BLOCKED' },
      { text: 'No verificado', value: 'NOT_VERIFIED' },
    ],
    elementClass: 'min-w-[400px]',
    label: 'Estado',
    position: 3,
  },

  {
    key: 'documentType',
    type: 'select-multiple',
    placeholder: 'Tipo de documento',
    items: [
      { text: 'DNI', value: 'DNI' },
      { text: 'CE', value: 'CE' },
      { text: 'PT', value: 'PT' },
      { text: 'RUC', value: 'RUC' },
    ],
    label: 'Tipo de documento',
    position: 4,
  },
  {
    key: 'createdAt',
    type: 'date-range',
    placeholder: 'Periodo',
    width: 'w-auto',
    label: 'Buscar por fecha de registro',
    position: 5,
  },
]

export const participantsHeader: HeaderItem[] = [
  {
    key: 'commonName',
    label: 'Nombre y apellidos',
    sortable: true,
  },
  {
    key: 'documentIdentifier',
    label: 'Documento',
    sortable: true,
  },
  {
    key: 'phoneNumber',
    label: 'Celular',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Correo',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
