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
          <SheetTrigger @click="openSheet('organization-form')">
            <Button variant="default">Crear organización</Button>
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
                <DropdownMenuItem
                  @click="handleSuspend(row.rucNumber)"
                  :disabled="row.status !== 'ACTIVE'"
                >
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
                  <DropdownMenuItem @click="handleUpdate(row)">
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
          :organization="selectedOrganization"
          :onsubmit="handleCreate"
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
import type { OrderItem } from "@/types/Order.ts";
import { organizationHeader } from "~/constants/organization";
import { useSheetStore } from "@/composables/useSheetStore.js";

const selectedOrganization = ref(null);
const { currentSheet, openSheet } = useSheetStore();
const { page, filterOptions, sortOptions, onSort, onSearch } = useOrder();
const BASE_ORG_URL = "/organization-management";
const { data, refresh }: any = await useAPI(
  `${BASE_ORG_URL}/find-organizations`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any
);

const orderData = computed(() =>
  data.value.data.map((item: OrderItem) => ({
    date: item.contractStartDate + " - " + item.contractEndDate,
    ...item,
  }))
);

const handleSuspend = async (rucNumber: string) => {
  console.log("rucNumber", rucNumber);

  const { status: suspendStatus }: any = await useAPI(
    `${BASE_ORG_URL}/suspend-organization`,
    {
      method: "POST",
      body: {
        rucNumber,
      },
    } as any
  );
  refresh();
};

const handleActivate = async (rucNumber: string) => {
  console.log("rucNumber", rucNumber);

  const { status: activateStatus }: any = await useAPI(
    `${BASE_ORG_URL}/activate-organization`,
    {
      method: "POST",
      body: {
        rucNumber,
      },
    } as any
  );
  refresh();
};

const handleCreate = async (values: any) => {
  try {
    const { status: createStatus }: any = await useAPI(
      `${BASE_ORG_URL}/create-organization`,
      {
        method: "POST",
        body: values,
      } as any
    );
    if (createStatus === 201) {
      console.log("Organización creada exitosamente");
      refresh(); // Actualiza la tabla después de crear la organización
    }
  } catch (error) {
    console.error("Error al crear la organización", error);
  }
};

const handleUpdate = (organization: any) => {
  selectedOrganization.value = organization;
  openSheet('organization-form');
};
</script>
