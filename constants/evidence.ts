import type { HeaderItem, SearchItem  } from "@/components/ui/custom-table/CustomTable.vue";

export const evidenceStatus = new Map<string, { name: string; color: string }>([
    ["DELIVERED", { name: "Entregado", color: "green" }],
    ["IN_REVIEW", { name: "En revisión de abono", color: "blue" }],
    ["CONFIRMED_DEPOSIT", { name: "Deposito confirmado", color: "red" }], 
    ["IN_TRANSFER_OF_GOOD", { name: "En transferencia de bienes", color: "brown" }],
]);

export const evidenceSearch: SearchItem[] = [
    {
        key: 'organization',
        type: 'text',
        placeholder: 'Buscar sustento',
        elementClass: 'min-w-[400px]',
        position: 1,
    },
    {
        key: 'status',
        type: 'select',
        placeholder: 'Filtrar estados',
        items: [...Array.from(evidenceStatus).map(([key, value]) => ({ text: value.name, value: key })), { text: 'Todos', value: " " }],
        elementClass: 'min-w-[400px]',
        position: 2,
    }
];

export const evidenceHeader: HeaderItem[] = [
    {
        key: "title",
        label: "Titulo oferta",
        sortable: true,
    },
    {
      key: "description",
      label: "Descripción",
      sortable: true,
    },
    {
      key: "Category of the good",
      sortable: true,
      label: "Categoría del bien",
    },
    {
      key: "Subcategory of the good",
      label: "Sub Categoría del bien",
      sortable: true,
    },   
    {
      key: "status",
      label: "Estado abono",
      sortable: true,
    },
    {
      key: "SupportForTransfer",
      label: "S. de Transferencia",
      align: "center",
      sortable: true,
    },
    {
      key: "SupportForDelivery",
      label: "S. de Entrega",
      align: "center",
      sortable: true,
    },
  ];
  