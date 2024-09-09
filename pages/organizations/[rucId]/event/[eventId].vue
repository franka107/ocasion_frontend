<template>
  <ContentLayout title="Eventos">
    <section>
      <EventDetails :eventDetail="eventDetail">
        <template #default>
          <Button
            v-if="isEventNotPublished"
            @click="handlePublishEvent"
            variant="default"
            class="bg-white text-primary border border-primary hover:bg-accent"
          >
            Publicar Evento
          </Button>
        </template>
      </EventDetails>
      <div>
        <OfferTable
          :offerData="offerData"
          :handleConfirmOffers="handleConfirmOffers"
          :handleRetireOffers="handleRetireOffers"
          :openModalOffer="openModalOffer"
          :editOffer="editOffer"
          :openModalDebate="openModalDebate"
          :openAppraisalHistoryModal="openAppraisalHistoryModal"
          :appraisalHistoryModal ="appraisalHistoryModal "
          :openModifyAppraisal="openModifyAppraisal"
        />
      </div>
    </section>
  </ContentLayout>
</template>
<script setup lang="ts">
import EventDetails from "~/components/events/EventDetails.vue";
import type {
  OfferListItem,
  IAmountHistoryModal,
} from "~/types/Offer";
import OfferTable from '@/components/events/OfferTable.vue';
import ContentLayout from "~/layouts/default/ContentLayout.vue";
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { page, sortOptions, editOffer, confirmOffers, retireOffers } = useOfferAPI();
const OFFER_BASE_URL = "/offer-management";
const { publishEvent } = useEvent()
const route = useRoute();
const { getEvent } = useEvent();
const PUBLISHED_STATUS = "PUBLISHED";
const isEventNotPublished = computed(() => eventDetail.value?.status !== PUBLISHED_STATUS);
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
);
const openModifyAppraisal = ref(false);
const openAppraisalHistoryModal = ref(false);
const appraisalHistoryModal = ref<IAmountHistoryModal>({ offerId: "" });
const openModalOffer = ref(false); 
const openModalDebate = ref(false); 
const resetMultipleSelect = ref<Function | undefined>(undefined);
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
