<template>
  <EvidencePage :organization-id="organizationId" />
</template>
<script setup lang="ts">
import EvidencePage from "~/components/evidence/EvidencePage.vue";
const route = useRoute();
const organizationId = route.params.organizationId as string;
</script>

  