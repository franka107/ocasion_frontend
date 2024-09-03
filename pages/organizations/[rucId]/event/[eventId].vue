<template>
  <ContentLayout title="Eventos">
    <section>
      <EventDetails :eventDetail="eventDetail">
        <template #default>
          <Button
            v-if="eventDetail?.status !== 'PUBLISHED'"
            @click="handlePublishEvent"
            variant="default"
            class="bg-white text-primary border border-primary hover:bg-accent"
          >
            Publicar Evento
          </Button>
        </template>
      </EventDetails>
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          v-if="!showBids"
          :data="offerData"
          :header="offerHeader"
          :search="offerSearch"
          @onSort="onSort"
          @onSearch="onSearch"
        >
          <template #action-button>
            <Button
              v-if="eventDetail?.status !== FINISHED_STATUS"
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
                        bindsId = row.id;
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
        <div>
          <CustomTable
            v-if="showBids"
            :data="pujasData"
            :header="pujasHeader"
            :search="pujasSearch"
            multipleSelect
            @onSort="onSort"
            @onSearch="onSearch"
            @on-multiple-select="
              ($event) => {
                selectedMultipleData = $event;
              }
            "
          >
            <template #action-button>
              <Button
                @click=""
                variant="default"
                :disabled="disableMultipleSelect"
                class="bg-white text-primary border border-primary hover:bg-accent"
              >
                Rechazar puja
              </Button>
              <Button
                @click=""
                :disabled="disableMultipleSelect"
                class="bg-white text-primary border border-primary hover:bg-accent"
                >Aceptar puja
              </Button>
              <Button
                @click=""
                :disabled="disableMultipleSelect"
                variant="default"
                >Contraofertar
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
                    <DropdownMenuItem
                      @click="
                        () => {
                          bindsId = undefined;
                          openModal = true;
                        }
                      "
                    >
                      <div class="flex items-center space-x-2">
                        <span>Historial de puja</span>
                        <CustomIcons name="Clock-Timer" class="ml-auto" />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </template>
            <template #status="{ row }">
              <CustomChip
                :text="BidStatus.get(row.status)?.name || ''"
                :variant="BidStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
          <!-- Fomulario -->
          <SheetContent
            v-model:open="openAppraisalHistoryModal"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
            class="flex flex-col h-full"
          >
            <HistoryForm
              :bindsId="bindsId"
              :offer-id="appraisalHistoryModal.offerId"
            />
          </SheetContent>
          <!-- Fomulario -->
        </div>
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
          :refreshTable="refresh"
        ></DebateModal>
        <AppraisalOfferModal
          v-model="openModifyAppraisal"
          :offer-id="changeAppraisalForm.offerId"
          :offer-title="changeAppraisalForm.offerName"
          :new-appraisal="changeAppraisalForm.newAppraisal"
          :old-appraisal="changeAppraisalForm.oldAppraisal"
          :refreshTable="refresh"
        ></AppraisalOfferModal>
      </div>
      <CustomPagination
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
        v-model:page="page"
      />
    </section>
  </ContentLayout>
</template>
<script setup lang="ts">
import EventDetails from "~/components/events/EventDetails.vue";
const BASE_OFFERS_URL = "/offer-management";
import { offerHeader, offerStatus, offerSearch } from "@/constants/offer";
import { pujasHeader, pujasSearch, BidStatus } from "@/constants/pujas";
import type {
  OfferListItem,
  IDebateForm,
  IChangeAppraisalForm,
  IAmountHistoryModal,
} from "~/types/Offer";
import type { OfferWithBidDto } from "~/types/Pujas";
import CustomIcons from "~/components/ui/custom-icons/CustomIcons.vue";
import OfferForm from "@/components/offers/OfferForm.vue";
import DebateModal from "@/components/offers/DebateModal.vue";
import HistoryForm from "@/components/history/HistoryForm.vue";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import AppraisalOfferModal from "~/components/offers/AppraisalOfferModal.vue";
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { page, sortOptions, onSort, createOffer, editOffer, publishEvent } =
  useOfferAPI();

const route = useRoute();
const { getEvent } = useEvent();
const offerId = ref(undefined);
const showBids = ref(false);
const bindsId = ref<number | undefined>(undefined);
const bidData = ref([]);
const FINISHED_STATUS = "FINISHED";
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
);
const filterOptions2 = ref(
  `[{ "field": "id", "type": "like", "value": "${route.params.eventId}" }]`,
);
const openModal = ref(false);
const openAppraisalHistoryModal = ref(false);
const openModalOffer = ref(false);
const openModalDebate = ref(false);
const openModifyAppraisal = ref(false);
const appraisalHistoryModal = ref<IAmountHistoryModal>({ offerId: "" });
const selectedDebateInfo = ref<IDebateForm>({ name: "", appraisal: 0, id: "" });
const changeAppraisalForm = ref<IChangeAppraisalForm>({
  offerId: "",
  offerName: "",
  oldAppraisal: 0,
  newAppraisal: 0,
});
const selectedMultipleData = ref({ type: "empty", ids: [] });
const disableMultipleSelect = computed(
  () =>
    selectedMultipleData.value.type === "empty" &&
    selectedMultipleData.value.ids.length === 0,
);
const onSearch = (item: { [key: string]: string }) => {
  const filters = [{ field: "title", type: "like", value: item.title || "" }];
  filterOptions.value = JSON.stringify(filters);
};

const [
  { data: eventDetail, refresh: refreshEventDetail },
  { data, refresh },
]: any = await Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${BASE_OFFERS_URL}/find-offers`, {
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

const pujasData = computed(() =>
  bidData.value.map((item: OfferWithBidDto, index: number) => ({
    code: String(index + 1),
    date: item.bid.createdAt,
    amount: `$${item.bid.amount}`,
    status: item.bid.status,
    ...item,
  })),
);

// Datos de puja
const refreshBids = async () => {
  const { data: result }: any = await useAPI(
    `${BASE_OFFERS_URL}/find-offers-with-bid-paginated`,
    {
      query: {
        limit: 10,
        page,
        filterOptions2,
        sortOptions,
      },
    } as any,
  );

  bidData.value = result.value.data || [];
  console.log("Data de pujas actualizada", bidData.value);
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
        refresh();
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
        refresh();
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
const handlePublishEvent = async () => {
  openConfirmModal({
    title: "Publicar Evento",
    message: `¿Estás seguro de que deseas publicar el evento ❝${route.params.eventId}❞?`,
    callback: async () => {
      try {
        const { status } = await publishEvent(route.params.eventId as string);
        if (status.value === "success") {
          refreshEventDetail();
          updateConfirmModal({
            title: "Evento Publicado",
            message: "El evento ha sido publicado exitosamente",
            type: "success",
          });
        } else {
          throw new Error("Error al publicar el evento");
        }
      } catch (error) {
        updateConfirmModal({
          title: "Error al Publicar Evento",
          message:
            "No se pudo publicar el evento. Por favor, intente nuevamente.",
          type: "error",
        });
      }
    },
  });
};
</script>
