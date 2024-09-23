<template>
  <section>
    <ContentLayout title="Listado de sustentos de transferencia y entrega" >
        <CustomSimpleCard
        title="Sustentos de transferencia y entrega"
        class="mb-6"
        sub-title="Validación y subsanación de sustentos cargados"
        
    />

  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="evidenceData"
        :header="evidenceHeader"
        :search="evidenceSearch"
        multipleSelect
        @onSort="onSort"
        @onSearch="onSearch"
        @on-multiple-select="({ ids, type, resetMultipleSelect: onResetMultipleSelect })=> { selectedMultipleData = { ids, type }; resetMultipleSelect = onResetMultipleSelect }"
      >
        <template #SupportForTransfer="{ row }">
        <div class="flex items-center cursor-pointer " @click="() => openSupportForTransferModal(row)">
         <CustomIcons 
         :name="row.SupportForTransfer?.icon || 'DefaultIcon'"
         :class="row.SupportForTransfer?.class || 'text-gray-400 w-6 h-6 mr-2'" 
          />
          <CustomIcons name="Doc-Details" class="ml-auto" 
          />
        </div>
        </template>
        <template #SupportForDelivery="{ row }">
        <div class="flex items-center cursor-pointer" @click="() => openDeliveryForTransferModal(row)">
         <!-- <CustomIcons 
         :name="row.SupportForTransfer?.icon || 'DefaultIcon'"
         :class="row.SupportForTransfer?.class || 'text-gray-400 w-6 h-6 mr-2'" 
          /> -->
          <CustomIcons name="Doc-Transfer" class="ml-auto"
           />
        </div>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="evidenceStatus.get(row.status)?.name || ''"
            :variant="evidenceStatus.get(row.status)?.color as any"
          ></CustomChip>
        </template>
      </CustomTable>
        <SheetContent
          v-model:open="openModalDetailSupport"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <SupportForm
            :id="supportId"
            :onSubmit="handleConfirmTransference"
            :closeModal="() => openModalDetailSupport = false"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openModalDeliveryTransfer"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <DeliveryForm
            :id ="deliveryId"
            :onSubmit="handleConfirmDelivery "
            :closeModal="() => openModalDeliveryTransfer = false"
          />
        </SheetContent>
    </div>
    <CustomPagination
      class="mt-5 mb-[19px]"
      :total="data.count"
      :limit="data.limit"
      v-model:page="page"
    /> 
  </div>
    </ContentLayout>
</section>
</template>
<script setup lang="ts">
import CustomTable from "@/components/ui/custom-table/CustomTable.vue";
import CustomChip from "@/components/ui/custom-chip/CustomChip.vue";
import CustomPagination from "@/components/ui/custom-pagination/CustomPagination.vue";
import type { EvidenseItem } from "@/types/Evidence.ts";
import { evidenceStatus, evidenceSearch, evidenceHeader} from "~/constants/evidence";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import CustomSimpleCard from "~/components/ui/custom-simple-card/CustomSimpleCard.vue";
import { GrantId } from "~/types/Grant";
import type {IDateModal} from "~/types/Evidence";
import DeliveryForm from "./DeliveryForm.vue";
import SupportForm from "./SupportForm.vue";

const filterOptions = ref('[]');
const openModalDeliveryTransfer = ref(false);
const openModalDetailSupport = ref(false);
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { editTransference, getTransference , confirmTransference , sortOptions, page, onSort  } = useEvidenceTransferAPI()
const {getDeliverySupport , confirmDeliverySupport ,  editDeliverySupport } = useEvidenceDeliveryAPI()
const { getMyGrants } = useAuthManagement();
const myGrants = await getMyGrants();

const supportId = ref<number | undefined>(undefined);
const deliveryId = ref<number | undefined | string>(undefined);
const dateModal = ref<IDateModal>({ id: "" });
const OFFER_BASE_URL = "/offer-management";
const selectedMultipleData = ref<{ type: string, ids: string[]}>({ type: 'empty', ids: [] });
const resetMultipleSelect = ref<Function | undefined>(undefined);
const disableMultipleSelect = computed(()=> selectedMultipleData.value.type === 'empty' && selectedMultipleData.value.ids.length === 0);
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: "title", type: "like", value: item.title || "" },
    { field: "status", type: "equal", value: item.status || "" },
  ]);
};

const { data, refresh }: any = await useAPI(
  `${OFFER_BASE_URL}/find-offers`,
  {
    query: {
      limit: 10,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
);
const evidenceData = computed(() =>
  data.value.data.map((item: EvidenseItem) => ({
    ...item,
  })),
);
const openSupportForTransferModal = (row: any) => {
  supportId.value = row.id;
  openModalDetailSupport.value = true;
};
const openDeliveryForTransferModal = (row: any) => {
  deliveryId.value = row.id;
  openModalDeliveryTransfer.value = true;
};

const handleConfirmTransference = async ( transferenceSupportId: string  ) => {
  openConfirmModal({
    title: "Confirmar Transferencia",
    message: `¿Está seguro de que deseas confirmar esta transferencia?`,
    callback: async () => {
      try {
        const { status } = await confirmTransference({ transferenceSupportId  });
        if (status.value === "success") {
          refresh();
          resetMultipleSelect.value?.();
          updateConfirmModal({
            title: "Transferencia confirmada",
            message: "La transferencia ha sido confirmado exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al confirmar esta transferencia");
        }
      } catch (error) {
        console.log("error", error);
        updateConfirmModal({
          title: "Error al confirmar Transferencia",
          message:
            "No se pudo confirmar esta Transferencia. Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};
const handleConfirmDelivery = async ( transferenceSupportId: string ) => {
  openConfirmModal({
    title: "Confirmar Transferencia",
    message: `¿Está seguro de que deseas confirmar esta transferencia?`,
    callback: async () => {
      try {
        const { status } = await confirmDeliverySupport({ transferenceSupportId });
        if (status.value === "success") {
          refresh();
          resetMultipleSelect.value?.();
          updateConfirmModal({
            title: "Transferencia confirmada",
            message: "La transferencia ha sido confirmado exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al confirmar esta transferencia");
        }
      } catch (error) {
        console.log("error", error);
        updateConfirmModal({
          title: "Error al confirmar Transferencia",
          message:
            "No se pudo confirmar esta Transferencia. Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};

const handleEditDelivery = async (values: any) => {
  openConfirmModal({
    title: "Actualizar transferencia",
    message: "¿Estás seguro de que deseas editar esta transferencia?",
    callback: async () => {
      const { status, error }: any = await editDeliverySupport(values);
      if (status.value === "success") {
        openModalDeliveryTransfer.value = false;
        refresh();
        updateConfirmModal({
          title: "Transferencia actualizado",
          message: "La transferencia ha sido actualizado exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "La transferencia no se pudo actualizar, intentalo más tarde";
        updateConfirmModal({
          title: "Error al actualizar transferencia",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

</script>./DeliveryForm.vue
