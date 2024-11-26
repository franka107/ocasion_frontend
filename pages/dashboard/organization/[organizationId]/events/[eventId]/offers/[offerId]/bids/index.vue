<template>
  <BidPage :event-id="eventId" :offer-id="offerId" />
</template>
<script setup lang="ts">
const route = useRoute()
const eventId = route.params.eventId as string
const offerId = route.params.offerId as string
</script>
