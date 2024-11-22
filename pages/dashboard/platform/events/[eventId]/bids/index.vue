<template>
  <BidPage :event-id="eventId" />
</template>
<script setup lang="ts">
const route = useRoute()
const eventId = route.params.eventId as string
</script>
