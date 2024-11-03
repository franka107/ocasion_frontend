<template>
  <ContentLayout title="Listado de pujas">
    <section class="bg-white rounded-lg px-6 py-[18px]">
        <h3 class="text-primary-950 mb-3 font-bold">Mis pujas ganadas</h3>
        <p class="text-gray-500">Visualización de las pujas ganadas</p>
    </section>
    <ParticipantBidTable />
  </ContentLayout>
</template>
<script setup lang="ts">
import ParticipantBidTable from '~/components/events/ParticipantBidTable.vue';
import ContentLayout from '~/layouts/default/ContentLayout.vue'
</script>
