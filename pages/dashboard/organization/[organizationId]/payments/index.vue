<template>
  <PaymentsPageOrg :organization-id="organizationId" />
</template>
<script setup lang="ts">
import PaymentsPageOrg from "~/components/payments/PaymentsPageOrg.vue";

const route = useRoute();
const organizationId = route.params.organizationId as string;
</script>

