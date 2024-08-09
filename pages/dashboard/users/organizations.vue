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
          <SheetTrigger @click="() => { handleResetData(); openSheet('organization-form'); }">
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
          :organization="selectedOrganization"
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
import type { OrderItem } from "@/types/Order.ts";
import { organizationHeader } from "~/constants/organization";
import { useSheetStore } from "@/composables/useSheetStore.js";

// const selectedOrganization = ref(null);
const selectedOrganization = ref<any | null>(null);
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

const handleResetData = () => {
  selectedOrganization.value = null; // Limpiar selectedOrganization
}

const handleUpdateForm = async (organization: any) => {
  // selectedOrganization.value = organization;
  await fetchOrganizationDetails(organization.rucNumber);
  openSheet("organization-form");
};

const handleEdit = async (values: any) => {
  try {
    const { status: updateStatus }: any = await useAPI(
      `${BASE_ORG_URL}/update-organization`,
      {
        method: "PUT",
        body: {
          ...(selectedOrganization.value ?? {}), // Fallback a un objeto vacío si es null
          ...values, // Merge existing details with new values
        },
      } as any
    );
    console.log("Organización actualizada exitosamente");
    refresh(); // Actualiza la tabla después de actualizar la organización
    selectedOrganization.value = null; // Limpiar selectedOrganization
  } catch (error) {
    selectedOrganization.value = null; // Limpiar selectedOrganization
    console.error("Error al actualizar la organización", error);
  }
};

const fetchOrganizationDetails = async (rucNumber: string) => {
  try {
    const { data: organizationDetails }: any = await useAPI(
      `${BASE_ORG_URL}/get-organization-detail`,
      {
        method: "GET",
        query: {
          rucNumber,
        },
      } as any
    );

    const {
      name,
      rucNumber: ruc,
      billingEmail,
      economicActivity,
      address,
      contractStartDate,
      contractEndDate,
      startPercentage,
      representativeFullName,
      representativeDocumentType,
      representativeDocumentIdentifier,
      representativePhoneNumber,
      attachedFiles,
    } = organizationDetails.value;

    selectedOrganization.value = {
      name,
      rucNumber: ruc,
      billingEmail: billingEmail || null,
      economicActivityId: economicActivity?.id || null,
      addressLine1: address?.addressLine1 || "",
      department: address?.district?.id.split("+")[0] || "",
      province: address?.district?.id.split("+")[1] || "",
      districtId: address?.district?.id.split("+")[2] || "",
      contractStartDate: contractStartDate || "",
      contractEndDate: contractEndDate || "",
      startPercentage: startPercentage || 0,
      representativeFullName: representativeFullName || "",
      representativeDocumentType: representativeDocumentType || "DNI",
      representativeDocumentIdentifier: representativeDocumentIdentifier || "",
      representativePhoneNumber: representativePhoneNumber || "",
      attachedFiles: attachedFiles || [],
    };

    console.log(selectedOrganization.value);
  } catch (error) {
    console.error("Error al obtener los detalles de la organización", error);
  }
};
</script>
