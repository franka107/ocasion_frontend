import type {
    HeaderItem,
    SearchItem,
  } from "@/components/ui/custom-table/CustomTable.vue";
  
  export const purseSearch: SearchItem[] = [
    {
        key: "typeOfMovement",
        type: "select",
        placeholder: "Seleccionar",
        label: "Tipo de Movimiento",
        items: [
          { text: "Todos", value: " " },
        ],
        elementClass: "min-w-[250px]",
        position: 1,
    },
    {
        key: "reason",
        type: "select",
        placeholder: "Seleccionar",
        label: "Motivo",
        items: [
          { text: "Todos", value: " " },
        ],
        elementClass: "min-w-[250px]",
        position: 2,
    },
    {
      key: "",
      type: "date",
      label: "Fecha de operación",
      placeholder: "Inicio",
      position: 3,
    },
    {
      key: "",
      type: "date",
      label: "-",
      placeholder: "Inicio",
      position: 4,
    },

  ];
  export const purseHeader: HeaderItem[] = [
    {
      key: "",
      label: "Fecha de operación",
      sortable: true,
    },
    {
      key: "typeOfMovement",
      label: "Tipo de movimiento",
      sortable: true,
    },
    {
      key: "reason",
      sortable: true,
      label: "Motivo",
    },
    {
      key: "amount",
      label: "Moneda",
      sortable: true,
    },
    {
      key: "amount",
      label: "Monto",
      align: "right",
      sortable: true,
    },
    {
      key: "status",
      label: "Estado",
      sortable: true,
    },
  ];
  