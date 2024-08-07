<script lang="ts" setup>
import { ref } from "vue";

import type { IUser } from "@/models/user";
import NoResults from "@/components/users/administrators/NoResults.vue";
import DataTable from "@/components/common/table/DataTable.vue";
import { columns as userColumns } from "@/components/users/administrators/columns";
import { CheckCircledIcon, CrossCircledIcon, CubeIcon } from "@radix-icons/vue";

const open = ref(false);
const editingUserId = ref<string | null>(null);
const users = ref([]);

const handleCreateClick = () => {
  editingUserId.value = null;
};

const handleDeleteClick = async (user: IUser) => {
  console.log(`Eliminar usuario con id: ${user.id}`);
};

const columns = addActions<IUser>({
  additionalColumns: userColumns,
  actions: [
    {
      label: 'Editar',
      // icon: "chevron-right",
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

<template>
    <div class="w-full space-y-4 my-4">
      <Sheet v-model:open="open">
        <DataTable
          :data="users"
          :columns="columns"
          :filter="{ field: 'name', placeholder: 'Buscar usuario...' }"
          :status="statuses"
          :noDataComponent="NoResults"
          @create="handleCreateClick"
        >
          <!-- <UserForm :userId="editingUserId" @update:open="open = false" /> -->
        </DataTable>
      </Sheet>
    </div>
</template>
