import type { HeaderItem, SearchItem } from "@/components/ui/custom-table/CustomTable.vue";

export const eventSearch: SearchItem[] = [
  {
      key: 'name',
      type: 'text',
      placeholder: 'Buscar rol',
      elementClass: 'min-w-[400px]',
      position: 2,
  },
  {
    key: "status",
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
]
export const roleHeader: HeaderItem[] = [
  {
    key: "name",
    label: "Nombre",
    sortable: true
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
  },
  {
    key: "actions",
    label: "Acciones",
    sortable: false,
    align: "center",
  },
];

