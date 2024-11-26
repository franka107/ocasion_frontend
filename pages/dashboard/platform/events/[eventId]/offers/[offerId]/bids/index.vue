<template>
  <BidPage :offer-id="offerId" :event-id="eventId" />
</template>
<script setup lang="ts">
const route = useRoute()
const offerId = route.params.offerId as string
const eventId = route.params.eventId as string
</script>
