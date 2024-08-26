import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';

export const userType = new Map<string, string>([
    ['SUPER_ADMIN', "Super Adminitrador"],
    ['PLATFORM_ADMIN', "Administrador de plataforma"],
    ['PLATFORM_USER', "Usuario plataforma"],
    ['ORGANIZATION_ADMIN', "Adminitrador de organizacion"],
    ['ORGANIZATION_USER', "Usuario de organizacion"],
    ['PARTICIPANT', "Participante"],
]);

export const administratorsHeader: HeaderItem[] = [{
    key: 'fullName',
    label: 'Nombre y apellidos',
    sortable: true,
    search: {
        type: 'text',
        placeholder: 'Buscar usuarios',
        position: 1,
    }
    },{
    key: 'document',
    label: 'Documento',
    sortable: true
    },{
    key: 'cellphone',
    label: 'Celular',
    sortable: true,
    },{
    key: 'email',
    label: 'Correo',
    sortable: true,
    },{
    key: 'type',
    label: 'Tipo de Usuario',
    sortable: true
    },{
    key: 'organization',
    label: 'Organización',
    sortable: true
    },{
    key: 'status',
    label: 'Estado',
    sortable: true,
    search: {
        type: 'select',
        placeholder: 'Filtrar estados',
        items: [
            { text: 'Activo', value: 'ACTIVE' },
            { text: 'Suspendido', value: 'SUSPENDED' },
        ],
        elementClass: 'min-w-[400px]',
        position: 3,
    }
    },{
    key: 'actions',
    label: '',
    sortable: false,
    align: 'center'
    }]
    