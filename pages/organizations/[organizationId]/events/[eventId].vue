<template>
  <ContentLayout title="Eventos">
    <section>
      <EventDetails :eventDetail="eventDetail">
        <template #default>
          <Button
            v-if="
              isEventNotPublished &&
              myGrants.data.value.includes(GrantId.PlatformEventsCanPublish)
            "
            @click="handlePublishEvent"
            variant="default"
            class="bg-white text-primary border border-primary hover:bg-accent"
          >
            Publicar Evento
          </Button>
        </template>
      </EventDetails>
      <div>
        <OfferTable />
      </div>
    </section>
  </ContentLayout>
</template>
<script setup lang="ts">
import EventDetails from "~/components/events/EventDetails.vue";
import OfferTable from "@/components/events/OfferTable.vue";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import { GrantId } from "~/types/Grant";
import { EventStatus } from "~/types/Event";

const { getMyGrants } = useAuthManagement();
const myGrants = await getMyGrants();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { publishEvent } = useEvent();
const route = useRoute();
const { getEvent } = useEvent();
const PUBLISHED_STATUS = "PUBLISHED";
const isEventNotPublished = computed(
  () => eventDetail.value?.status !== PUBLISHED_STATUS,
);
const { data: eventDetail, refresh: refreshEventDetail } = await getEvent(
  route.params.eventId as string,
);

const handlePublishEvent = async () => {
  openConfirmModal({
    title: "Publicar Evento",
    message: `¿Estás seguro de que deseas publicar el evento ❝${route.params.eventId}❞?`,
    callback: async () => {
      try {
        const { status, error } = await publishEvent(
          route.params.eventId as string,
        );
        if (status.value === "success") {
          refreshEventDetail();
          updateConfirmModal({
            title: "Evento Publicado",
            message: "El evento ha sido publicado exitosamente",
            type: "success",
          });
        } else {
          console.log("erro publi", error);
          const eMsg =
            error.value.data?.errors?.[0].message ||
            error.value.data.message ||
            "No se pudo publicar el evento. Por favor, intente nuevamente.";
          updateConfirmModal({
            title: "Error al Publicar Evento",
            message: eMsg,
            type: "error",
          });
        }
      } catch (error: any) {}
    },
  });
};
</script>
