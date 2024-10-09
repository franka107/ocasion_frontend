<template>
  <PaymentPage :organization-id="organizationId" type="organization" />
</template>
<script setup lang="ts">
import PaymentPage from "~/components/payments/PaymentPage.vue";

const route = useRoute();
const organizationId = route.params.organizationId as string;
</script>
