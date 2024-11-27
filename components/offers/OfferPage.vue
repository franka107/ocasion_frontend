<template>
  <ContentLayout title="Eventos">
    <section>
      <EventDetails :event-detail="eventDetail">
        <template #default>
          <Button
            v-if="
              myGrants.data.value.includes(GrantId.PlatformEventsCanPublish) &&
              eventStatusCheckPosition(
                eventDetail.status,
                EventStatus.Published,
                ComparisonOperator.Less,
              )
            "
            variant="default"
            class="bg-white text-primary border border-primary hover:bg-accent"
            @click="handlePublishEvent"
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
import EventDetails from '~/components/events/EventDetails.vue'
import OfferTable from '@/components/events/OfferTable.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import { EventStatus } from '~/types/Event'
import { GrantId } from '~/types/Grant'
import { eventStatus, eventStatusCheckPosition } from '~/constants/events'
import { ComparisonOperator } from '~/constants/offer'
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { publishEvent } = useEvent()

const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const route = useRoute()
const { getEvent } = useEvent()
const PUBLISHED_STATUS = 'PUBLISHED'
const isEventNotPublished = computed(
  () =>
    eventDetail.value?.status !== EventStatus.Published &&
    eventDetail.value?.status !== EventStatus.InProgress &&
    eventDetail.value?.status !== EventStatus.Completed &&
    eventDetail.value?.status !== EventStatus.Finished,
)
const props = defineProps<{ eventId: string }>()
const { data: eventDetail, refresh: refreshEventDetail } = await getEvent(
  props.eventId as string,
)

const handlePublishEvent = async () => {
  openConfirmModal({
    title: 'Publicar Evento',
    message: `¿Estás seguro de que deseas publicar el evento ❝${props.eventId}❞?`,
    callback: async () => {
      try {
        const { status, error } = await publishEvent(props.eventId as string)
        if (status.value === 'success') {
          refreshEventDetail()
          updateConfirmModal({
            title: 'Evento Publicado',
            message: 'El evento ha sido publicado exitosamente',
            type: 'success',
          })
        } else {
          console.log('erro publi', error)
          const eMsg =
            error.value.data?.errors?.[0].message ||
            error.value.data.message ||
            'No se pudo publicar el evento. Por favor, intente nuevamente.'
          updateConfirmModal({
            title: 'Error al Publicar Evento',
            message: eMsg,
            type: 'error',
          })
        }
      } catch (error) {}
    },
  })
}
</script>
