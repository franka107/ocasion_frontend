import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'

export const userType = new Map<string, string>([
  ['PLATFORM_ADMIN', 'Administrador de plataforma'],
  ['PLATFORM_USER', 'Usuario plataforma'],
  ['ORGANIZATION_ADMIN', 'Administrador de organizacion'],
  ['SUPER_ADMIN', 'Super administrador'],
  ['ORGANIZATION_USER', 'Usuario de organizacion'],
])

export const administratorsSearch = (viewType: ViewType): SearchItem[] => [
  ...(viewType === 'organization'
    ? []
    : [
        {
          key: 'organizationName',
          type: 'text' as any,
          placeholder: 'Buscar por organización',
          position: 1,
        },
      ]),
  {
    key: 'fullName',
    type: 'text',
    placeholder: 'Buscar por nombre y apellidos',
    position: 1,
  },
  {
    key: 'email',
    type: 'text',
    placeholder: 'Buscar por email',
    position: 1,
  },
  {
    key: 'phoneNumber',
    type: 'text',
    placeholder: 'N. Celular',
    position: 1,
  },
  {
    key: 'createdAt',
    type: 'date',
    placeholder: 'Fecha de creación',
    position: 1,
  },
  {
    key: 'status',
    type: 'select',
    placeholder: 'Filtrar estados',
    items: [
      { text: 'Activo', value: 'ACTIVE' },
      { text: 'Suspendido', value: 'SUSPENDED' },
      { text: 'Todos', value: ' ' },
    ],
    elementClass: 'min-w-[400px]',
    position: 3,
  },
]

export const administratorsHeader = (viewType: ViewType): HeaderItem[] => [
  ...(viewType === 'organization'
    ? []
    : [
        {
          key: 'organization',
          label: 'Organización',
          sortable: true,
        },
      ]),
  {
    key: 'fullName',
    label: 'Nombre y apellidos',
    sortable: true,
  },
  {
    key: 'document',
    label: 'Documento',
    sortable: true,
  },
  {
    key: 'cellphone',
    label: 'Celular',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Correo',
    sortable: true,
  },
  {
    key: 'type',
    label: 'Tipo de Usuario',
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
