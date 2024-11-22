<template>
  <OfferPage :event-id="eventId" />
</template>
<script setup lang="ts">
import OfferPage from '~/components/offers/OfferPage.vue'

const route = useRoute()
const eventId = route.params.eventId as string
</script>
