import type { HeaderItem } from "@/components/ui/custom-table/CustomTable.vue";

export const userType = new Map<string, string>([
  ["PLATFORM_ADMIN", "Administrador de plataforma"],
  ["PLATFORM_USER", "Usuario plataforma"],
  ["ORGANIZATION_ADMIN", "Administrador de organizacion"],
  ["SUPER_ADMIN", "Super Administrador"],
  ["ORGANIZATION_USER", "Usuario de organizacion"],
]);

export const participantsHeader: HeaderItem[] = [
  {
    key: "fullName",
    label: "Nombre y apellidos",
    sortable: true,
  },
  {
    key: "document",
    label: "Documento",
    sortable: true,
  },
  {
    key: "cellphone",
    label: "Celular",
    sortable: true,
  },
  {
    key: "email",
    label: "Correo",
    sortable: true,
  },
  {
    key: "organization",
    label: "Organización",
    sortable: true,
  },
  {
    key: "status",
    label: "Estado",
    sortable: true,
  },
  {
    key: "actions",
    label: "",
    sortable: false,
    align: "center",
  },
];

