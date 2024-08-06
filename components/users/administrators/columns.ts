import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

import type { IUser } from "@/models/user";

import DataTableColumnHeader from "@/components/common/table/DataTableColumnHeader.vue";

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Nombre y Apellidos" }),
    cell: ({ row }) => h("div", { class: "w-40" }, row.getValue("name")),
  },
  {
    accessorKey: "dni",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "DNI" }),
    cell: ({ row }) => h("div", { class: "w-20" }, row.getValue("dni")),
  },
  {
    accessorKey: "phone",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Numero de Celular" }),
    cell: ({ row }) => h("div", { class: "w-30" }, row.getValue("phone")),
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Correo" }),
    cell: ({ row }) => h("div", { class: "w-40" }, row.getValue("email")),
  },
  {
    accessorKey: "role",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Rol de Usuario" }),
    cell: ({ row }) => h("div", { class: "w-20" }, row.getValue("role")),
  },
  {
    accessorKey: "address",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Direccion" }),
    cell: ({ row }) => h("div", { class: "w-40" }, row.getValue("address")),
  },
  {
    accessorKey: "department",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Departamento" }),
    cell: ({ row }) => h("div", { class: "w-30" }, row.getValue("department")),
  },
  {
    accessorKey: "province",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Provincia" }),
    cell: ({ row }) => h("div", { class: "w-30" }, row.getValue("province")),
  },
  {
    accessorKey: "district",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Distrito" }),
    cell: ({ row }) => h("div", { class: "w-30" }, row.getValue("district")),
  },

];
