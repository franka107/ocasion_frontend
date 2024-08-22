import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';

export const organizationHeader: HeaderItem[] = [{
    key: 'rucNumber',
    label: 'RUC',
    sortable: true,
    search: {
        type: 'text',
        placeholder: 'Buscar RUC',
        position: 1,
    }
    }, {
    key: 'name',
    label: 'Razón social',
    sortable: true,
    search: {
        type: 'text',
        placeholder: 'Buscar nombre de organización',
        elementClass: 'min-w-[400px]',
        position: 2,
    }
    }, {
    key: 'date',
    label: 'Fecha de inicio y fecha de fin del contrato',
    },{
    key: 'status',
    label: 'Estado',
    sortable: true,
    search: {
        type: 'select',
        placeholder: 'Filtrar por estado',
        items: [
            { text: 'Activo', value: 'ACTIVE' },
            { text: 'Suspendido', value: 'SUSPENDED' },
            { text: 'Todos', value: " " },
        ],
        elementClass: 'min-w-[400px]',
        position: 3,
    }
    },{
    key: 'representativeFullName',
    label: 'Usuario',
    sortable: true
    },{
    key: 'representativePhoneNumber',
    label: 'Número de administrador',
    sortable: true
    },{
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center'
    }]
    