<template>
  <section v-if="!showBids">
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-6">
        <CustomTable
          :data="offerData"
          :header="offerHeader"
          :search="offerSearch"
          multipleSelect
          @onSort="onSort"
          @onSearch="onSearch"
          @on-multiple-select="
            ({ ids, type, resetMultipleSelect: onResetMultipleSelect }) => {
              selectedMultipleData = { ids, type };
              resetMultipleSelect = onResetMultipleSelect;
            }
          "
        >
          <template #action-button>
            <Button
              v-if="
                isOfferActionsVisible &&
                myGrants.data.value.includes(
                  GrantId.OrganizationOffersCanConfirm,
                )
              "
              @click="handleConfirmOffers(selectedMultipleData)"
              class="bg-white text-primary border border-primary hover:bg-accent"
              variant="default"
              :disabled="disableMultipleSelect"
              >Confirmar oferta
            </Button>
            <Button
              v-if="
                isOfferActionsVisible &&
                myGrants.data.value.includes(GrantId.PlatformOfferCanRetire)
              "
              @click="handleRetireOffers(selectedMultipleData)"
              class="bg-white text-primary border border-primary hover:bg-accent"
              variant="default"
              :disabled="disableMultipleSelect"
              >Retirar oferta
            </Button>
            <div
              v-if="
                myGrants.data.value.includes(GrantId.PlatformOfferCanCreate)
              "
            >
              <Button
                v-if="eventDetail?.status !== EventStatus.Published"
                @click="
                  () => {
                    offerId = undefined;
                    openModalOffer = true;
                  }
                "
                variant="default"
                >Crear oferta
              </Button>
            </div>
            <Button @click="handleViewBids" variant="default"
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
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOfferCanUpdate,
                      )
                    "
                  >
                    <DropdownMenuItem
                      :disabled="
                        row.status === OfferStatus.Confirmed ||
                        eventDetail?.status === EventStatus.Published
                      "
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
                  </div>

                  <DropdownMenuItem
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.OrganizationOffersCanDiscuss,
                      )
                    "
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
                    <div class="flex items-center space-x-2">
                      <span>Historial tasaciones</span>
                      <CustomIcons name="Clock-Timer" class="ml-auto" />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOfferCanUpdateAppraisal,
                      )
                    "
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
            :endpoint="auditBidHistories"
            title="Historial de tasaciones"
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
            :organizationId="String(route.params.organizationId)"
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
  <section v-else>
    <BidTable />
  </section>
</template>

<script setup lang="ts">
import { offerHeader, offerStatus, offerSearch } from "@/constants/offer";
import {
  type OfferListItem,
  type IDebateForm,
  type IChangeAppraisalForm,
  type IAmountHistoryModal,
  OfferStatus,
} from "~/types/Offer";
import CustomIcons from "~/components/ui/custom-icons/CustomIcons.vue";
import OfferForm from "@/components/offers/OfferForm.vue";
import DebateModal from "@/components/offers/DebateModal.vue";
import BidTable from "@/components/events/BidTable.vue";
import AppraisalOfferModal from "~/components/offers/AppraisalOfferModal.vue";
import { GrantId } from "~/types/Grant";
import { EventStatus } from "~/types/Event";

const { getMyGrants } = useAuthManagement();
const myGrants = await getMyGrants();
const auditBidHistories = "/audit/find-audit-histories";
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const {
  page,
  sortOptions,
  onSort,
  createOffer,
  editOffer,
  confirmOffers,
  retireOffers,
} = useOfferAPI();
const OFFER_BASE_URL = "/offer-management";
const route = useRoute();
const { getEvent } = useEvent();
const offerId = ref(undefined);
const showBids = ref(false);
const bidsId = ref<number | undefined>(undefined);
// const isOfferActionsVisible = computed(
//   () => eventDetail.value?.status !== EventStatus.Published,
// );

const isOfferActionsVisible = computed(
  () =>
    eventDetail.value?.status !== EventStatus.Published &&
    eventDetail.value?.status !== EventStatus.InProgress &&
    eventDetail.value?.status !== EventStatus.Completed &&
    eventDetail.value?.status !== EventStatus.Finished,
);
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
);
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
const selectedMultipleData = ref<{ type: string; ids: string[] }>({
  type: "empty",
  ids: [],
});
const resetMultipleSelect = ref<Function | undefined>(undefined);
const disableMultipleSelect = computed(
  () =>
    selectedMultipleData.value.type === "empty" &&
    selectedMultipleData.value.ids.length === 0,
);
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: "title", type: "like", value: item.title || "" },
    { field: "event.id", type: "equal", value: route.params.eventId },
  ]);
};

const [
  { data: eventDetail, refresh: refreshEventDetail },
  { data, refresh: refreshOfferTable },
]: any = await Promise.all([
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
//Funcion cambia vista de pujas
const handleViewBids = async () => {
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
          title: "Error al actualizar evento",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleConfirmOffers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: "Confirmar Ofertas",
    message: `¿Está seguro de aprobar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { type, ids } = values;
        const { status } = await confirmOffers({
          type,
          ids,
          eventId: String(route.params.eventId),
        });
        if (status.value === "success") {
          refreshOfferTable();
          resetMultipleSelect.value?.();
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
          message:
            "No se pudo confirmar oferta(s). Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};

const handleRetireOffers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: "Retirar Ofertas",
    message: `¿Está seguro de retirar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { status } = await retireOffers({
          ...values,
          eventId: String(route.params.eventId),
        });

        if (status.value === "success") {
          refreshOfferTable();
          resetMultipleSelect.value?.();
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
          message:
            "No se pudo retirar oferta(s). Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};
</script>
