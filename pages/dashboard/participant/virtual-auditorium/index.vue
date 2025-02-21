<template>
  <ContentLayout
    title="Mis Ofertas"
    subtitle="Auditorio Virtual"
    custom-class="lg:px-[16px]"
  >
    <div class="flex text-[12px] font-[400] mb-[16px]">
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">
        Auditorio Virtual/
      </h1>
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">
        Mis ofertas
      </h1>
    </div>
    <section
      class="rounded-[12px] bg-white w-full max-w-[1324px] px-[24px] py-[16px]"
    >
      <div class="tabs-container">
        <!-- Tabs con scroll horizontal en móviles -->
        <div class="flex justify-between">
          <ScrollArea
            class="flex border-b border-gray-300 text-[#AFAFB1] gap-x-2 md:gap-x-4 whitespace-nowrap text-[12px] md:text-[16px]"
          >
            <div class="flex gap-x-[16px]">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                :class="[
                  'pt-[8px] pb-[16px] font-[500]',
                  {
                    'text-[#20445E] border-b-2 border-[#20445E]':
                      activeTab === index,
                  },
                ]"
                @click="activeTab = index"
              >
                {{ tab.label }}
              </button>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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
                    <strong>Ofertas Activas:</strong> Son todas a las que puedes
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
                    <strong>Ganadas:</strong> Todas las ofertas que ganaste.
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
        <OffersPage :api-url="currentApiUrl" @any-bid-place="onAnyBidPlaced" />
      </div>
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import OffersPage from '~/components/virtual-auditorium/OffersPage.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
interface IOfferTypeCount {
  inProgressCount: number
  guarantedCount: number
  participatingCount: number
  wonCount: number
  expiredCount: number
}

const { data: offerHeaderData, refresh: refreshOfferHeaderData } =
  await useAPI<IOfferTypeCount>(
    () => `/offer-management/view-offers-type-count`,
    {} as any,
  )

const onAnyBidPlaced = () => {
  refreshOfferHeaderData()
}

const activeTab = ref(0)
const currentApiUrl = computed(() => tabs.value[activeTab.value].apiUrl)

const tabs = computed(() => [
  {
    label: `Ofertas Activas ${offerHeaderData.value?.inProgressCount ?? 0}`,
    apiUrl: 'find-offers-paginated-for-participant',
  },
  {
    label: `Garantizadas ${offerHeaderData.value?.guarantedCount ?? 0}`,
    apiUrl: 'find-offers-paginated-for-participant-guaranted',
  },
  {
    label: `Participando ${offerHeaderData.value?.participatingCount ?? 0}`,
    apiUrl: 'find-offers-paginated-for-participant-participating',
  },
  {
    label: `Ganadas ${offerHeaderData.value?.wonCount ?? 0}`,
    apiUrl: 'find-offers-paginated-for-participant-won',
  },
  {
    label: `Vencidas ${offerHeaderData.value?.expiredCount ?? 0}`,
    apiUrl: 'find-offers-paginated-for-participant-expired',
  },
])
</script>
