<template>
  <ContentLayout title="Mis Ofertas" subtitle="Auditorio Virtual" customClass="lg:px-[16px]">
    <div class="flex text-[12px] font-[400] mb-[16px]">
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Auditorio Virtual/</h1>
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Mis ofertas</h1>
    </div>
    <section class="rounded-[12px] bg-white w-full max-w-[1324px] px-[24px] py-[16px]">
      <div class="tabs-container">
        <!-- Tabs con scroll horizontal en móviles -->
        <div class="flex justify-between">
          <div class="flex border-b border-gray-300 mb-4 text-[#AFAFB1] gap-x-2 md:gap-x-4 overflow-x-auto whitespace-nowrap text-[12px] md:text-[16px]">
            <button v-for="(tab, index) in tabs" :key="index"
              :class="['pt-[8px] pb-[16px] font-semibold px-2 sm:px-4', { 'text-[#20445E] border-b-2 border-[#20445E]': activeTab === index }]"
              @click="activeTab = index">
              {{ tab.label }}
            </button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline" class="border-none">
                  <CustomIcons
                    name="Info_pin"
                    class="w-full h-full text-primary"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                class="w-[273px] px-[13px] transform translate-y-1/2"
              >
                <ul class="text-[14px] text-[#68686C] leading-[20px]">
                  <li>
                    <strong>Ofertas:</strong> Son todas a las que puedes
                    acceder.
                  </li>
                  <li>
                    <strong>Garantizada:</strong> Ofertas con garantía de
                    participación.
                  </li>
                  <li>
                    <strong>Participando:</strong> Ofertas en las que estás
                    participando.
                  </li>
                  <li>
                    <strong>Ganas:</strong> Todas las ofertas que ganaste.
                  </li>
                  <li>
                    <strong>Vencidas:</strong> Ofertas que caducaron o se
                    terminaron.
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <OffersPage :api-url="currentApiUrl" />
      </div>
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import OffersPage from '~/components/virtual-auditorium/OffersPage.vue'

interface IOfferTypeCount {
    inProgressCount: number
    guarantedCount: number
    participatingCount: number
    wonCount: number
    expiredCount: number
}

const { data } = await useAPI<IOfferTypeCount>(
  () => `/offer-management/find-offers-type-count`,
  {} as any,
)

const activeTab = ref(0);
const currentApiUrl = computed(() => tabs[activeTab.value].apiUrl);
const tabs = [
  { label: `Ofertas ${data.value.inProgressCount}`, apiUrl: 'find-offers-paginated-for-participant' },
  { label: `Garantizadas ${data.value.guarantedCount}`, apiUrl: 'find-offers-paginated-for-participant-guaranted' },
  { label: `Participando ${data.value.participatingCount}`, apiUrl: 'find-offers-paginated-for-participant-participating' },
  { label: `Ganadas ${data.value.wonCount}`, apiUrl: 'find-offers-paginated-for-participant-won' },
  { label: `Vencidas ${data.value.expiredCount}`, apiUrl: 'find-offers-paginated-for-participant-expired' },
];
</script>
