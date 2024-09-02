import type { HeaderItem, SearchItem } from "@/components/ui/custom-table/CustomTable.vue";

export const BidStatus = new Map<string, string>([
    ['BASE', "Base"],
    ['GIVEN_UP', "Desistida"],
    ['WINNER', "Ganadora"],
    ['DISCARDED', "Descartada"],
]);

export const pujasSearch: SearchItem[] = [
    {
        key: 'title',
        type: 'text',
        placeholder: 'Buscar oferta',
        elementClass: 'min-w-[400px]',
        position: 1,
    },
    {
        key: 'status',
        type: 'select',
        placeholder: 'Filtrar estados',
        items: [
            { text: 'Activo', value: 'ACTIVE' },
            { text: 'Suspendido', value: 'SUSPENDED' },
            { text: 'Todos', value: " " },
        ],
        elementClass: 'min-w-[400px]',
        position: 2,
    }
]
export const pujasHeader: HeaderItem[] = [
{
    key: 'checkbox',
    label: '-',
},{
    key: 'code',
    label: 'Código',
    sortable: true,
},{
    key: 'title',
    label: 'Bien',
    sortable: true,
},{
    key: 'date',
    sortable: true,
    label: 'Fecha y hora',
},{
    key: "amount",
    label: "Monto",
    sortable: true,
},{
    key: 'appraisal',
    label: 'Tasación',
    align: 'right',
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
