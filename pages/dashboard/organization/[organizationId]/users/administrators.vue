<template>
  <AdministratorsPage :organization-id="organizationId" />
</template>
<script setup lang="ts">
import AdministratorsPage from '~/components/users/administrators/AdministratorsPage.vue'
const organizationId = useRoute().params.organizationId as string
</script>
