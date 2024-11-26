<template>
  <BidPage :offer-id="offerId" />
</template>
<script setup lang="ts">
const route = useRoute()
const offerId = route.params.offerId as string
</script>
