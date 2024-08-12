import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';

export const eventType = new Map<string, string>([
    ['HAND_OVER', "Puesta en mano"],
    ['AUCTION', "Subasta"],
]);
export const eventStatus = new Map<string, { name: string, color: string}>([
    ['PUBLISHED', { name: 'Publicado', color: 'blue'}],
    ['CANCELLED', { name: 'Cancelado', color: 'red'}],
    ['CREATED', { name: 'Creado', color: 'purple'}],
    ['FINISHED', { name: 'Finalizado', color: 'brown'}],
    ['IN_DEBATE', { name: 'En debate', color: 'orange'}],
    ['READY_TO_PUBLISH', { name: 'Listo para publicar', color: 'green'}],
]);

export const  goodType = new Map<string, string>([
    ['CARS_AND_MOTORCYCLES', "carros y motocicletas"],
    ['HOUSE', "Casas"],
]);
export const eventListHeaders: HeaderItem[] = [{
    key: 'id',
    label: 'Código',
    sortable: true,
    }, {
    key: 'name',
    label: 'Evento',
    sortable: true,
    search: {
        type: 'text',
        placeholder: 'Buscar eventos',
    }
    }, {
    key: 'type',
    label: 'Tipo',
    },{
    key: 'createdAt',
    label: 'Creación',
    sortable: true,
    },{
    key: 'startDate',
    label: 'Fecha de inicio',
    sortable: true
    },{
    key: 'endDate',
    label: 'Fecha de cierre',
    sortable: true
    },{
    key: 'amount',
    label: 'Monto Esperado',
    sortable: true
    },{
    key: 'status',
    label: 'Estado',
    sortable: true
    },{
    key: 'actions',
    label: '',
    sortable: false,
    align: 'center'
    }]
    