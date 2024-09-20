<template>
  <section>
	<ContentLayout title="Abonos" >
		<CustomSimpleCard
        title="Abonos"
        class="mb-6"
        sub-title="..."
        
    />

  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="paymentsData"
        :header="paymentsHeader"
        :search="paymentsSearch"
        multipleSelect
        @onSort="onSort"
        @onSearch="onSearch"
        @on-multiple-select="({ ids, type, resetMultipleSelect: onResetMultipleSelect })=> { selectedMultipleData = { ids, type }; resetMultipleSelect = onResetMultipleSelect }"
      >
      <template #action-button>
        <Button
              @click=""
              variant="default"
              :disabled="disableMultipleSelect"
              >Aprobar
        </Button>
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
           <DropdownMenuContent
               align="start"
               class="bg-primary text-white"
           >
             <div
              v-if="
                myGrants.data.value.includes(
                  GrantId.PlatformPaymentCanObserve,
                )
                "
             >
                <DropdownMenuItem 
                @click="() => {
                        paymentsId = row.id;
                        openModalObservePayment = true;
                    }
                ">
                        Observar abono
                    <CustomIcons name="EyeIcon" class="ml-auto" />
                </DropdownMenuItem>
            </div>
              <DropdownMenuSeparator />
              <div
                v-if="
                myGrants.data.value.includes(
                  GrantId.PlatformPaymentCanConfirm,
                )
                "
              >
                <DropdownMenuItem @click="handleConfirmPayment(row.id)">
                        Confirmar abono 
                    <CustomIcons name="ArrowLeft" class="ml-auto" />
                </DropdownMenuItem>
              </div>
           </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="paymentStatus.get(row.status)?.name || ''"
            :variant="paymentStatus.get(row.status)?.color as any"
          ></CustomChip>
        </template>
      </CustomTable>
      <SheetContent
          v-model:open="openModalObservePayment"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <PaymentsForm
            :id="paymentsId"
            :onSubmit="handleObserve"
            :closeModal="() => openModalObservePayment = false"
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
import type { IPaymentsLItem } from "@/types/Payment.ts";
import { paymentsHeader, paymentStatus, paymentsSearch} from "~/constants/payments";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import CustomSimpleCard from "~/components/ui/custom-simple-card/CustomSimpleCard.vue";
import { GrantId } from "~/types/Grant";

const filterOptions = ref('[]');
const openModalObservePayment = ref(false);
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { confirmPayment, observePayment, page, sortOptions, onSort } = usePaymentAPI()
const { getMyGrants } = useAuthManagement();
const myGrants = await getMyGrants();
const paymentsId = ref<number | undefined>(undefined);
const BASE_PAY_URL = "/payment-management";
const selectedMultipleData = ref<{ type: string, ids: string[]}>({ type: 'empty', ids: [] });
const resetMultipleSelect = ref<Function | undefined>(undefined);
const disableMultipleSelect = computed(()=> selectedMultipleData.value.type === 'empty' && selectedMultipleData.value.ids.length === 0);
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: "status", type: "equal", value: item.status || "" },
    { field: "organization.name", type: "equal", value: item.organization }
  ]);
};
const { data, refresh }: any = await useAPI(
  `${BASE_PAY_URL}/find-payments-paginated`,
  {
    query: {
      limit: 10,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
);

const paymentsData = computed(() => 
  data.value.data.map((item: IPaymentsLItem, index: number) => ({
    code: "-",
    supportingDetails:"Documento.pdf",
    date: new Date(item.submittedAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ...item, 
    event: item.event?.name || "-", 
    organization: item.organization.name || "-"
  }))
);

const handleConfirmPayment = async ( paymentId: string ) => {
  console.log( paymentId)
  openConfirmModal({
    title: "Confirmar abono",
    message: `¿Está seguro de que deseas confirmar este abono?`,
    callback: async () => {
      try {
        // const { paymentId } = values;
        const { status } = await confirmPayment({ paymentId });
        if (status.value === "success") {
          refresh();
          resetMultipleSelect.value?.();
          updateConfirmModal({
            title: "Abono confirmado",
            message: "El abono ha sido confirmado exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al confirmar este abono");
        }
      } catch (error) {
        console.log("error", error);
        updateConfirmModal({
          title: "Error al confirmar Abono",
          message:
            "No se pudo confirmar Abono. Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};

const handleObserve = async (values: any) => {
  openConfirmModal({
    title: "Actualizar abono",
    message: "¿Estás seguro de que deseas actualizar este Abono?",
    callback: async () => {
      const { status, error }: any = await observePayment(values);
      if (status.value === "success") {
        openModalObservePayment.value = false;
        refresh();
        updateConfirmModal({
          title: "Abono actualizado",
          message: "El abono ha sido actualizado exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "El abono no se pudo actualizar, intentalo más tarde";
        updateConfirmModal({
          title: "Error al actualizar bono",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

</script>
