import type { HeaderItem } from "@/components/ui/custom-table/CustomTable.vue";

export const roleHeader: HeaderItem[] = [
  {
    key: "name",
    label: "Nombre",
    sortable: true,
    search: {
      type: "text",
      placeholder: "Buscar rol",
      position: 1,
    },
  },
  {
    key: "usersCount",
    label: "Cant.",
    sortable: true,
  },
  {
    key: "description",
    label: "Descripción",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Fecha de creación",
    sortable: true,
  },
  {
    key: "updatedAt",
    label: "Última modificación",
    sortable: true,
  },
  {
    key: "status",
    label: "Estado",
    sortable: true,
    search: {
      type: "select",
      placeholder: "Filtrar por estado",
      items: [
        { text: "Activo", value: "ACTIVE" },
        { text: "Inactivo", value: "INACTIVE" },
        { text: "Todos", value: " " },
      ],
      elementClass: "min-w-[400px]",
      position: 3,
    },
  },
  {
    key: "actions",
    label: "Acciones",
    sortable: false,
    align: "center",
  },
];

