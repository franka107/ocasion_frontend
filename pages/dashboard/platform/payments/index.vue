<template>
  <PaymentsPagePlatf :organization-id="organizationId" />
</template>
<script setup lang="ts">
import PaymentsPagePlatf from "~/components/payments/PaymentsPagePlatf.vue";

const route = useRoute();
const organizationId = route.params.organizationId as string;
</script>

