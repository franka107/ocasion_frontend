<template>
  <div class="space-y-8">
    <!-- Contenido de pujas -->
    <BidPage :event-id="eventId" :offer-id="offerId" />
  </div>
</template>

<script setup lang="ts">
import BidPage from '~/components/bid/BidPage.vue'

const route = useRoute()
const eventId = route.params.eventId as string
const offerId = route.params.offerId as string
</script>
