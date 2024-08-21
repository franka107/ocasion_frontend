<template>
  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="roleData"
        :header="roleHeader"
        @onSort="onSort"
        @onSearch="onSearch"
      >
        <template #action-button>
          <SheetTrigger @click="() => { roleId = undefined; openSheet('role-form'); }">
            <Button variant="default">Agregar</Button>
          </SheetTrigger>
        </template>
        <template #actions="{ row }">
          <div class="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 data-[state=open]:bg-accent"
                >
                  <CustomIcons name="VerticalDots" class="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="bg-primary text-white">
                <SheetTrigger class="w-full" @click="() => { roleId = row.id; openSheet('role-form') }">
                  <DropdownMenuItem>
                    Editar
                    <CustomIcons name="Pen" class="ml-auto" />
                  </DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NuxtLink :to="`/`">Ver Detalle</NuxtLink>
                  <CustomIcons name="EyeIcon" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleDelete(row.roleName)" :disabled="row.status !== 'Activo'">
                  Eliminar
                  <CustomIcons name="Trash" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="row.status === 'Activo' ? 'Activo' : 'Suspendido'"
            :variant="row.status === 'Activo' ? 'default' : 'destructive'"
          ></CustomChip>
        </template>
      </CustomTable>
      <SheetContent
        v-if="currentSheet === 'role-form'"
        class="flex flex-col h-full"
      >
        <RolesForm
          :id="roleId"
          :onsubmit="roleId !== undefined ? handleEdit : handleCreate"
        />
      </SheetContent>
    </div>
    <!-- <CustomPagination
      class="mt-5 mb-[19px]"
      :total="data.count"
      :limit="data.limit"
      v-model:page="page"
    /> -->
  </div>
</template>

<script setup lang="ts">
import CustomTable from "@/components/ui/custom-table/CustomTable.vue";
import CustomChip from "@/components/ui/custom-chip/CustomChip.vue";
import CustomIcons from "@/components/ui/custom-icons/CustomIcons.vue";
import CustomPagination from "@/components/ui/custom-pagination/CustomPagination.vue";
import { roleHeader } from "~/constants/roles";
import { useSheetStore } from "@/composables/useSheetStore.js";
import { useRoles } from "@/composables/useRoles";
import ConfirmModal from "~/components/ui/confirm-modal/ConfirmModal.vue";
import RolesForm from "@/components/roles/RolesForm.vue";
import { type IRoleItem } from "~/types/Roles";
import type { IDataResponse } from "~/types/Common";
import type { IOrganizationSummary } from "~/types/Roles";

const route = useRoute()
const { currentSheet, openSheet, closeSheet } = useSheetStore();
const { page, filterOptions, sortOptions, onSort, onSearch, deleteRole, createRole, editRole } = useRoles();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const roleId = ref<number | undefined>(undefined);
const BASE_ROLE_URL = '/role-configuration'

const { data, refresh, error} : any = await useAPI(`${BASE_ROLE_URL}/find-roles`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions
  },
} as any);
console.log('API Response:', data);
console.log('Error:', error);
console.log('Data Value:', data.value); 

const roleData = computed(() => {
  if (!Array.isArray(data.value)) return [];
  return data.value.map((item: IRoleItem) => ({
    roleName: item.name,
    quantity: '1', 
    creationDate: 'DD/MM/AAAA',
    lastModifiedDate: 'DD/MM/AAAA', 
  }));
});
console.log('API Response:', data.value);

const handleDelete = async (roleName: string) => {
  openConfirmModal({title: 'Eliminar rol',message: `¿Está seguro que desea eliminar el rol ❝${roleName}❞?`,callback: async () => {
      const { status } = await deleteRole(roleName);
      if (status === 'success') {
        updateConfirmModal({
          title: '¡Eliminación exitosa!',
          message: 'El rol ha sido eliminado.',
          type: 'success',
        });
        refresh();
      } else {
        updateConfirmModal({
          title: 'Error al eliminar',
          message: 'El rol no se pudo eliminar. \nTe recomendamos intentarlo nuevamente.',
          type: 'error',
        });
      }
    },
  });
};

const handleCreate = async (values: any) => {
  openConfirmModal({title: 'Crear rol',message: '¿Estás seguro de que deseas crear este rol?',callback: async () => {
      const { status, error } = await createRole(values);
      if (status === 'success') {
        closeSheet();
        refresh();
        updateConfirmModal({
          title: 'Rol creado',
          message: 'El rol ha sido creado exitosamente',
          type: 'success',
        });
      } else {
        const eMsg = error?.data?.errors?.[0]?.message || error?.data?.message || 'El rol no se pudo crear, intentalo más tarde';
        updateConfirmModal({
          title: 'Error al crear rol',
          message: eMsg,
          type: 'error',
        });
      }
    },
  });
};

const handleEdit = async (values: any) => {
  openConfirmModal({title: 'Actualizar rol',message: '¿Estás seguro de que deseas actualizar este rol?',callback: async () => {
      const { status, error } = await editRole(values);
      if (status === 'success') {
        closeSheet();
        refresh();
        updateConfirmModal({
          title: 'Rol actualizado',
          message: 'El rol ha sido actualizado exitosamente',
          type: 'success',
        });
      } else {
        const eMsg = error?.data?.errors?.[0]?.message || error?.data?.message || 'El rol no se pudo actualizar, intentalo más tarde';
        updateConfirmModal({
          title: 'Error al actualizar rol',
          message: eMsg,
          type: 'error',
        });
      }
    },
  });
};
</script>
