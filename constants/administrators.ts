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
  ['PARTICIPANT', 'Participante'],
])

export const administratorsSearch = (viewType: ViewType): SearchItem[] => [
  ...(viewType === 'organization'
    ? []
    : [
        {
          key: 'organizationName',
          type: 'text' as any,
          label: 'Buscar por organización',
          position: 1,
        },
      ]),
  {
    key: 'fullName',
    type: 'text',
    label: 'Nombres y apellidos',
    position: 1,
  },
  {
    key: 'email',
    type: 'text',
    label: 'Buscar por email',
    position: 1,
  },
  {
    key: 'phoneNumber',
    type: 'text',
    label: 'N. Celular',
    position: 1,
  },
  // {
  //   key: 'createdAt',
  //   type: 'date',
  //   placeholder: 'Fecha de creación',
  //   position: 1,
  // },
  {
    key: 'createdAt',
    type: 'date-range',
    label: 'Fecha de creación',
    placeholder: 'Inicio',
    width: 'w-auto',
  },
  {
    key: 'status',
    type: 'select',
    label: 'Filtrar estados',
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
          key: 'organizations',
          label: 'Organización/es',
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
