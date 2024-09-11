import type { HeaderItem, SearchItem } from "@/components/ui/custom-table/CustomTable.vue";

export const bidStatus = new Map<string, { name: string; color: string }>([
    ["BASE", { name: "Base", color: "purple" }],
    ["GIVEN_UP", { name: "Desistida", color: "blue" }],
    ["WINNER", { name: "Ganadora", color: "green" }],
    ["DISCARDED", { name: "Descartada", color: "gray" }],
]);

export const bidsSearch: SearchItem[] = [
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
        items: [...Array.from(bidStatus).map(([key, value]) => ({ text: value.name, value: key })), { text: 'Todos', value: " " }],
        elementClass: 'min-w-[400px]',
        position: 2,
    }
]
export const bidsHeader: HeaderItem[] = [
{
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
