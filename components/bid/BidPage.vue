<template>
  <ContentLayout title="Pujas">
    <section>
      <EventDetails :event-detail="eventDetail"> </EventDetails>

      <div>
        <BidTable :event-id="props.eventId" :offer-id="props.offerId" />
      </div>
    </section>
  </ContentLayout>
</template>
<script setup lang="ts">
import BidTable from '../events/BidTable.vue'
import EventDetails from '~/components/events/EventDetails.vue'
import OfferTable from '@/components/events/OfferTable.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import { EventStatus } from '~/types/Event'
import { GrantId } from '~/types/Grant'
import { eventStatus } from '~/constants/events'
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
const props = defineProps<{ eventId?: string; offerId?: string }>()
const { data: eventDetail, refresh: refreshEventDetail } = await getEvent(
  props.eventId as string,
)
</script>
