<template>
  <RolePage :organization-id="organizationId" />
</template>
<script setup lang="ts">
import RolePage from "~/components/roles/RolePage.vue";
const organizationId = useRoute().params.organizationId as string;
</script>
