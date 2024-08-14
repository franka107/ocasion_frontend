<template>
    <div class="w-full flex flex-col">
      <Sheet v-model:open="open">
        <DataTable
          createButtonLabel="Crear organización"
          :data="users"
          :columns="columns"
          :filters="[{ field: 'name', placeholder: 'Buscar usuario...' }]"
          :status="statuses"
          :noDataComponent="NoResults"
          @create="handleCreateClick"
        >
          <!-- <UserForm :userId="editingUserId" @update:open="open = false" /> -->
        </DataTable>
      </Sheet>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

import type { IUser } from "@/models/user";
import NoResults from "@/components/users/administrators/NoResults.vue";
import DataTable from "@/components/common/table/DataTable.vue";
import { columns as userColumns } from "@/components/users/administrators/columns";
import { CheckCircledIcon, CrossCircledIcon, CubeIcon } from "@radix-icons/vue";

const open = ref(false);
const editingUserId = ref<string | null>(null);
  const users = ref<IUser[]>([
  {
    id: "1",
    name: "Juan Pérez",
    dni: "12345678",
    phone: "987654321",
    email: "juan.perez@example.com",
    role: "Admin",
    address: "Av. Libertador 123",
    department: "Lima",
    province: "Lima",
    district: "Miraflores",
    status: "",
    is_deleted: false,
    created_at: "",
    updated_at: null
  },
  {
    id: "2",
    name: "Ana Gómez",
    dni: "23456789",
    phone: "976543210",
    email: "ana.gomez@example.com",
    role: "User",
    address: "Calle Real 456",
    department: "Arequipa",
    province: "Arequipa",
    district: "Cayma",
    status: "",
    is_deleted: false,
    created_at: "",
    updated_at: null
  },
  {
    id: "3",
    name: "Carlos Fernández",
    dni: "34567890",
    phone: "965432109",
    email: "carlos.fernandez@example.com",
    role: "Moderator",
    address: "Jr. de la Unión 789",
    department: "Cusco",
    province: "Cusco",
    district: "Centro Histórico",
    status: "",
    is_deleted: false,
    created_at: "",
    updated_at: null
  },
  {
    id: "4",
    name: "María López",
    dni: "45678901",
    phone: "954321098",
    email: "maria.lopez@example.com",
    role: "User",
    address: "Av. Brasil 321",
    department: "Lima",
    province: "Lima",
    district: "San Isidro",
    status: "",
    is_deleted: false,
    created_at: "",
    updated_at: null
  }]);

const handleCreateClick = () => {
  // editingUserId.value = null;
  users.value = [...users.value, {
    id: "5",
    name: "1232112",
    dni: "45678901",
    phone: "954321098",
    email: "maria.lopez@example.com",
    role: "User",
    address: "Av. Brasil 321",
    department: "Lima",
    province: "Lima",
    district: "San Isidro",
    status: "",
    is_deleted: false,
    created_at: "",
    updated_at: null
  }]
};

const handleDeleteClick = async (user: IUser) => {
  console.log(`Eliminar usuario con id: ${user.id}`);
};

const columns = addActions<IUser>({
  additionalColumns: userColumns,
  actions: [
    {
      label: 'Editar',
      icon: "chevron-right",
      isDisabled: () => false,
      onClick: (user: { id: string | null; }) => (editingUserId.value = user.id),
    }
  ]
});

const statuses = [
  {
    value: "ACTIVE",
    label: "Activo",
    icon: CheckCircledIcon,
  },
  {
    value: "INACTIVE",
    label: "Inactivo",
    icon: CrossCircledIcon,
  },
  {
    value: "SUSPENDED",
    label: "Suspendido",
    icon: CubeIcon,
  },
];
</script>

