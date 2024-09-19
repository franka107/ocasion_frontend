import type { HeaderItem, SearchItem  } from "@/components/ui/custom-table/CustomTable.vue";

export const paymentStatus = new Map<string, { name: string; color: string }>([
    ["OBSERVED", { name: "Abono observado", color: "orange" }],
    ["IN REVIEW", { name: "En revisión de abono", color: "blue" }],
    ["CONFIRMED", { name: "Abono confirmado", color: "green" }],
    ["CANCELLED", { name: "Cancelada", color: "red" }],
    ["CONCRETED", { name: "Concretada", color: "brown" }],
]);
export const paymentsSearch: SearchItem[] = [
    {
        key: 'organization',
        type: 'text',
        placeholder: 'Buscar organización',
        elementClass: 'min-w-[400px]',
        position: 1,
    },
    {
        key: 'status',
        type: 'select',
        placeholder: 'Filtrar estados',
        items: [...Array.from(paymentStatus).map(([key, value]) => ({ text: value.name, value: key })), { text: 'Todos', value: " " }],
        elementClass: 'min-w-[400px]',
        position: 2,
    }
]
export const paymentsHeader: HeaderItem[] = [
    {
      key: "code",
      label: "Cód. Oferta",
      sortable: true,
    },
    {
      key: "event",
      label: "Evento",
      sortable: true,
    },
    {
      key: "organization",
      label: "Organización",
      sortable: true,
    },
    {
      key: "supportingDetails",
      label: "Detalle sustento",
      sortable: true,
    },
    {
      key: "date",
      label: "Fecha de envio",
      sortable: true,
    },
    {
        key: "amount",
        label: "Monto de sustento",
        sortable: true,
      },
    {
      key: "status",
      label: "Estado abono",
      sortable: true,
    },
    {
      key: "actions",
      label: "Acciones",
      sortable: false,
      align: "center",
    },
  ];
  
  