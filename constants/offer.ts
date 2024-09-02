import type { HeaderItem, SearchItem } from '@/components/ui/custom-table/CustomTable.vue';

export const offerStatus = new Map<string, { name: string, color: string}>([
    ['RETIRED', { name: 'Retirado', color: 'red'}],
    ['CONFIRMED', { name: 'Confirmado', color: 'green'}],
    ['NEW', { name: 'Nuevo', color: 'purple'}],
    ['DEBATED', { name: 'Debadito', color: 'orange'}],
    ['CANCELLED', { name: 'Cancelado', color: 'brown'}],
    ['REJECTED', { name: 'Rechazado', color: 'red'}],
]);
export const offerSearch: SearchItem[] = [
    {
        key: 'title',
        type: 'text',
        placeholder: 'Buscar oferta',
        elementClass: 'min-w-[400px]',
        position: 2,
    }
]
export const offerHeader: HeaderItem[] = [{
        key: 'id',
        label: 'N°',
        sortable: true,
    }, {
        key: 'title',
        label: 'Bien',
        sortable: true,
    }, {
        key: 'brandName',
        sortable: true,
        label: 'Marca',
    },{
        key: 'modelName',
        label: 'Modelo',
        sortable: true,
    },{
        key: 'year',
        label: 'Año',
        sortable: true
    },{
        key: 'status',
        label: 'Estado',
        sortable: true
    },{
        key: 'attachedFiles',
        label: 'Fotos',
        sortable: true
    },{
        key: 'addressCity',
        label: 'Ubicación',
        sortable: true
    },{
        key: 'appraisal',
        label: 'Tasación',
        align: 'right',
        sortable: true
    },{
        key: 'initialValue',
        label: 'Valor inicial',
        align: 'right',
        sortable: true
    },{
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center'
    }]
    