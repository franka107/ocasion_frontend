<template>
  <section v-if="!showBids" >
  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-6">
      <CustomTable
          :data="offerData"
          :header="offerHeader"
          :search="offerSearch"
          multipleSelect
          @onSort="onSort"
          @onSearch="onSearch"
          @on-multiple-select="({ ids, type, resetMultipleSelect: onResetMultipleSelect })=> { selectedMultipleData = { ids, type }; resetMultipleSelect = onResetMultipleSelect }"
        >
          <template #action-button>
            <Button
              v-if="isOfferActionsVisible"
              @click="handleConfirmOffers(selectedMultipleData)"
              class="bg-white text-primary border border-primary hover:bg-accent"
              variant="default"
              :disabled="disableMultipleSelect"
            >Confirmar oferta
            </Button>
            <Button
               v-if="isOfferActionsVisible" 
              @click="handleRetireOffers(selectedMultipleData)"
              class="bg-white text-primary border border-primary hover:bg-accent"
              variant="default"
              :disabled="disableMultipleSelect"
              >Retirar oferta
            </Button>
            <Button
              v-if="isOfferActionsVisible"
              @click="
                () => {
                  offerId = undefined;
                  openModalOffer = true;
                }
              "
              variant="default"
              >Crear oferta
            </Button>
            <Button v-else @click="handleViewBids" variant="default"
              >Ver pujas
            </Button>
          </template>
          <template #attachedFiles>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full bg-[#0B38590A]"
            >
              <CustomIcons name="Clip" />
            </div>
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
                  <DropdownMenuItem
                    @click="
                      () => {
                        offerId = row.id;
                        openModalOffer = true;
                      }
                    "
                  >
                    Editar
                    <CustomIcons name="Pen" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="
                      () => {
                        openModalDebate = true;
                        selectedDebateInfo = {
                          name: eventDetail.name,
                          appraisal: row.appraisal,
                          id: row.id,
                        };
                      }
                    "
                  >
                    Debatir
                    <CustomIcons name="Mallet" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="
                      () => {
                        bidsId = row.id;
                        openAppraisalHistoryModal = true;
                        appraisalHistoryModal = { offerId: row.id };
                      }
                    "
                  >
                    Historial tasaciones
                    <CustomIcons name="Clock-Timer" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="
                      () => {
                        openModifyAppraisal = true;
                        changeAppraisalForm = {
                          offerId: row.id,
                          offerName: row.title,
                          oldAppraisal: row.appraisal,
                          newAppraisal: row.appraisal,
                        };
                      }
                    "
                  >
                    Modificar tasación
                    <CustomIcons name="Pen" class="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="offerStatus.get(row.status)?.name || ''"
              :variant="offerStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
            v-model:open="openAppraisalHistoryModal"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
            class="flex flex-col h-full"
          >
            <HistoryForm
              :bidsId="bidsId"
              :offer-id="appraisalHistoryModal.offerId"
            />
          </SheetContent>
        <SheetContent
          v-model:open="openModalOffer"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <OfferForm
            :id="offerId"
            :eventId="String(route.params.eventId)"
            :rucId="String(route.params.rucId)"
            :onsubmit="offerId !== undefined ? handleEdit : handleCreate"
          />
        </SheetContent>
        <DebateModal
          v-model="openModalDebate"
         :id="selectedDebateInfo.id"
         :name="selectedDebateInfo.name"
         :appraisal="selectedDebateInfo.appraisal"
         :refreshTable="refreshOfferTable"
        ></DebateModal>
        <AppraisalOfferModal
          v-model="openModifyAppraisal"
          :offer-id="changeAppraisalForm.offerId"
          :offer-title="changeAppraisalForm.offerName"
          :new-appraisal="changeAppraisalForm.newAppraisal"
          :old-appraisal="changeAppraisalForm.oldAppraisal"
          :refreshTable="refreshOfferTable"
        ></AppraisalOfferModal>
     </div>
     <CustomPagination 
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
        v-model:page="page"
      />
    </div>
  </section>
  <section v-if="showBids">
          <BidTable :bidsData="bidsData" :search="bidsSearch" @onSort="onSort" @onSearch="onSearch" />
  </section>
</template>

<script setup lang="ts">
import { offerHeader, offerStatus, offerSearch } from "@/constants/offer";
import { bidsSearch } from "@/constants/bids";
import type {
  OfferListItem,
  IDebateForm,
  IChangeAppraisalForm,
  IAmountHistoryModal,
} from "~/types/Offer";
import type { OfferWithBidDto } from "~/types/Bids";
import CustomIcons from "~/components/ui/custom-icons/CustomIcons.vue";
import OfferForm from "@/components/offers/OfferForm.vue";
import DebateModal from "@/components/offers/DebateModal.vue";
import BidTable from '@/components/events/BidTable.vue';
import AppraisalOfferModal from "~/components/offers/AppraisalOfferModal.vue";
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { page, sortOptions, onSort, createOffer, editOffer, confirmOffers, retireOffers } = useOfferAPI();
const OFFER_BASE_URL = "/offer-management";
const route = useRoute();
const { getEvent } = useEvent();
const offerId = ref(undefined);
const showBids = ref(false);
const bidsId = ref<number | undefined>(undefined);
const bidData = ref([]);
const FINISHED_STATUS = "FINISHED";
const PUBLISHED_STATUS = "PUBLISHED";
const isOfferActionsVisible = computed(() => eventDetail.value?.status !== FINISHED_STATUS);
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
);
const filterOptions2 = ref(
  `[{ "field": "id", "type": "like", "value": "${route.params.eventId}" }]`,
);
const openModal = ref(false);
const openModifyAppraisal = ref(false);
const openAppraisalHistoryModal = ref(false);
const appraisalHistoryModal = ref<IAmountHistoryModal>({ offerId: "" });
const changeAppraisalForm = ref<IChangeAppraisalForm>({
  offerId: "",
  offerName: "",
  oldAppraisal: 0,
  newAppraisal: 0,
});

const openModalOffer = ref(false); 
const openModalDebate = ref(false); 
const selectedDebateInfo = ref<IDebateForm>({ name: "", appraisal: 0, id: "" }); 
const selectedMultipleData = ref<{ type: string, ids: string[]}>({ type: 'empty', ids: [] });
const resetMultipleSelect = ref<Function | undefined>(undefined);
const disableMultipleSelect = computed(()=> selectedMultipleData.value.type === 'empty' && selectedMultipleData.value.ids.length === 0);
const onSearch = (item: { [key: string]: string }) => {
  const filters = [{ field: "title", type: "like", value: item.title || "" }];
  filterOptions.value = JSON.stringify(filters);
};

const  [{ data: eventDetail, refresh: refreshEventDetail }, { data, refresh: refreshOfferTable }]: any = await Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${OFFER_BASE_URL}/find-offers`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any),
]);
const offerData = computed(() =>
  data.value.data.map((item: OfferListItem) => ({
    brandName: item.carModel.brand.name,
    modelName: item.carModel.name,
    addressCity: item.address.district.city.name,
    ...item,
  })),
);

const bidsData = computed(() =>
  bidData.value.map((item: OfferWithBidDto, index: number) => ({
    code: String(index + 1),
    date: new Date(item.bid.createdAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    amount: `$${item.bid.amount}`,
    status: item.bid.status,
    ...item,
  })),
);

// Datos de puja
const refreshBids = async () => {
  const { data: result }: any = await useAPI(`${OFFER_BASE_URL}/find-offers-with-bid-paginated`, {
    query: {
      limit: 8,
      page,
      filterOptions : filterOptions2,
      sortOptions,
    },
  } as any);
  bidData.value = result.value.data || [];
};

//Funcion cambia vista de pujas
const handleViewBids = async () => {
  await refreshBids();
  showBids.value = true;
  console.log("Bids view enabled", showBids.value);
};

const handleCreate = async (values: any) => {
  openConfirmModal({
    title: "Crear Oferta",
    message: "¿Estás seguro de que deseas crear este Oferta?",
    callback: async () => {
      const { status, error }: any = await createOffer(values);
      if (status.value === "success") {
        openModalOffer.value = false;
        refreshOfferTable();
        updateConfirmModal({
          title: "Oferta creada",
          message: "La oferta ha sido creada exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "La oferta no se pudo crear, intentalo más tarde";
        updateConfirmModal({
          title: "Error al crear Oferta",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleEdit = async (values: any) => {
  openConfirmModal({
    title: "Actualizar Oferta",
    message: "¿Estás seguro de que deseas actualizar este Oferta?",
    callback: async () => {
      const { status, error }: any = await editOffer(values);
      if (status.value === "success") {
        openModalOffer.value = false;
        refreshOfferTable();
        updateConfirmModal({
          title: "Oferta actualizada",
          message: "La oferta ha sido actualizado exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "El evento no se pudo actualizar, intentalo más tarde";
        updateConfirmModal({
          title: "Error al crear evento",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleConfirmOffers = async (values: { type: string, ids: string[]}) => {
  openConfirmModal({
    title: "Confirmar Ofertas",
    message: `¿Está seguro de aprobar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { type, ids } = values
        const { status } = await confirmOffers({ type, ids });
        if (status.value === "success") {
          refreshOfferTable();
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: "Oferta(s) confirmada(s)",
            message: "La(s) oferta(s) ha sido confirmada(s) exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al confirmar esta(s) oferta(s)");
        }
      } catch (error) {
        console.log("error", error);
        updateConfirmModal({
          title: "Error al confirmar Oferta(s)",
          message: "No se pudo confirmar oferta(s). Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};

const handleRetireOffers = async (values: { type: string, ids: string[]}) => {
  openConfirmModal({
    title: "Retirar Ofertas",
    message: `¿Está seguro de retirar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { status } = await retireOffers(values);
       
        if (status.value === "success") {
          refreshOfferTable();
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: "Oferta(s) retirada(s)",
            message: "La(s) oferta(s) ha sido retirada(s) exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al retirar esta(s) oferta(s)");
        }
      } catch (error) {
        updateConfirmModal({
          title: "Error al retirar Oferta(s)",
          message: "No se pudo retirar oferta(s). Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};
</script>
