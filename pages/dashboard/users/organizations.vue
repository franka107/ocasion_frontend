<template>
  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="orderData"
        :header="organizationHeader"
        @onSort="onSort"
        @onSearch="onSearch"
      >
        <template #action-button>
          <SheetTrigger @click="() => { organizationRucNo = undefined; openSheet('organization-form'); }">
            <Button
              variant="default"
              >Crear organización</Button
            >
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
                <DropdownMenuItem>
                  <NuxtLink :to="`/dashboard/events/organization/${row.rucNumber}`">Ver Organización</NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleSuspend(row.rucNumber)" :disabled="row.status !== 'ACTIVE'">
                  Suspender
                  <CustomIcons name="Forbidden" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  @click="handleActivate(row.rucNumber)"
                  :disabled="row.status === 'ACTIVE'"
                >
                  Activar
                  <CustomIcons name="Reload" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SheetTrigger @click="openSheet('organization-form')">
                  <DropdownMenuItem @click="handleUpdateForm(row)">
                    Actualizar datos
                    <CustomIcons name="ArrowLeft" class="ml-auto" />
                  </DropdownMenuItem>
                </SheetTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
            :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
          ></CustomChip>
        </template>
      </CustomTable>
      <!-- Fomulario -->
      <SheetContent
        v-if="currentSheet === 'organization-form'"
        class="flex flex-col h-full"
      >
        <OrganizationForm
          :ruc-number="organizationRucNo"
          :onsubmit="selectedOrganization ? handleEdit : handleCreate"
        />
      </SheetContent>
      <!-- Fomulario -->
    </div>
    <CustomPagination
      class="mt-5 mb-[19px]"
      :total="data.count"
      :limit="data.limit"
      v-model:page="page"
    />
  </div>
</template>
<script setup lang="ts">
import OrganizationForm from "@/components/users/organizations/form.vue";
import CustomTable from "@/components/ui/custom-table/CustomTable.vue";
import CustomChip from "@/components/ui/custom-chip/CustomChip.vue";
import CustomIcons from "@/components/ui/custom-icons/CustomIcons.vue";
import CustomPagination from "@/components/ui/custom-pagination/CustomPagination.vue";
import type { OrganizationItem } from '@/types/Order.ts';
import { organizationHeader } from "~/constants/organization";
import { useSheetStore } from "@/composables/useSheetStore.js";
import { useOrganization } from "@/composables/useOrganization";

// const selectedOrganization = ref(null);
const selectedOrganization = ref<any | null>(null);
const { currentSheet, openSheet } = useSheetStore();
const { page, filterOptions, sortOptions, onSort, onSearch, suspendOrganization, activateOrganization, createOrganization, editOrganization } = useOrganization()
const BASE_ORG_URL = '/organization-management'
const { data, refresh } : any = await useAPI(`${BASE_ORG_URL}/find-organizations`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions
  },
} as any);
const organizationRucNo = ref<number | undefined>(undefined)

const orderData= computed(() => data.value.data.map((item: OrganizationItem) => ({
    "date": item.contractStartDate + ' - ' + item.contractEndDate,
    ...item
  })))

const handleSuspend = async (rucNumber: string) => {
  await suspendOrganization(rucNumber)
  refresh()
}

const handleActivate = async (rucNumber: string) => {
  await activateOrganization(rucNumber)
  refresh();
};

const handleCreate = async (values: any) => {
  await createOrganization(values)
  refresh();
};

const handleResetData = () => {
  selectedOrganization.value = null; // Limpiar selectedOrganization
}

const handleUpdateForm = async (organization: any) => {
  // selectedOrganization.value = organization;
  organizationRucNo.value = organization.rucNumber;
  openSheet("organization-form");
};

const handleEdit = async (values: any) => {
  await editOrganization(values)
  refresh();
};
</script>
