<template>
  <EventPage :organization-id="organizationId" />
</template>
<script setup lang="ts">
import EventPage from "~/components/events/EventPage.vue";

const route = useRoute();
const organizationId = route.params.organizationId as string;
</script>
