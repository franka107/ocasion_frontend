import type { HeaderItem, SearchItem } from '@/components/ui/custom-table/CustomTable.vue';
export const organizationSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar RUC',
        position: 1,
    },{
        key: 'name',
        type: 'text',
        placeholder: 'Buscar nombre de organización',
        elementClass: 'min-w-[400px]',
        position: 2,
    },{
        key: 'status',
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
]
export const organizationHeader: HeaderItem[] = [{
    key: 'id',
    label: 'RUC',
    sortable: true,
    }, {
    key: 'name',
    label: 'Razón social',
    sortable: true,
    }, {
    key: 'date',
    label: 'Fecha de inicio y fecha de fin del contrato',
    },{
    key: 'status',
    label: 'Estado',
    sortable: true,
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
    