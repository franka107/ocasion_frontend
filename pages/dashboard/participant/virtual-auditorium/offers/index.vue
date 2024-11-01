<template>
  <ContentLayout title="Mis Ofertas" subtitle="Auditorio Virtual">
    <div class="flex text-[12px] font-[400] mb-[16px]">
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Auditorio Virtual/</h1>
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Mis ofertas</h1>
    </div>
    <section class="rounded-[12px] bg-white w-full max-w-[1324px] px-[24px] py-[16px]">
      <div class="tabs-container">
        <!-- Tabs -->
        <div class="flex justify-between">
          <div class="flex border-b border-gray-300 mb-4 text-[#AFAFB1] gap-x-4">
            <button v-for="(tab, index) in tabs" :key="index"
              :class="['flex pt-[8px] pb-[16px] font-semibold', { 'text-[#20445E] border-b-2 border-[#20445E]': activeTab === index }]"
              @click="activeTab = index">
              {{ tab.label }}
            </button>
          </div>
          <button type="button" class="w-[20px]"><CustomIcons name="Info_pin" class="w-full h-full text-primary" /></button>
        </div>
        <div v-if="activeTab === 0">
          <OffersPage />
        </div>
        <div v-else-if="activeTab === 1">
          <p>Garantizadas - Aquí puedes agregar contenido específico de esta sección.</p>
        </div>
        <div v-else-if="activeTab === 2">
          <p>Participando - Aquí puedes agregar contenido específico de esta sección.</p>
        </div>
        <div v-else-if="activeTab === 3">
          <p>Ganadas - Aquí puedes agregar contenido específico de esta sección.</p>
        </div>
        <div v-else-if="activeTab === 4">
          <p>Vencidas - Aquí puedes agregar contenido específico de esta sección.</p>
        </div>
      </div>
    </section>
  </ContentLayout>
</template>
<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import OffersPage from '~/components/virtual-auditorium/OffersPage.vue'
const activeTab = ref(0);
const tabs = [
  { label: 'Ofertas 00' },
  { label: 'Garantizadas 00' },
  { label: 'Participando 00' },
  { label: 'Ganadas 00' },
  { label: 'Vencidas 00' },
];
</script>
