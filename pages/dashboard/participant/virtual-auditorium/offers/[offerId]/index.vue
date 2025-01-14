<script setup lang="ts">
import dayjs from 'dayjs'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import DetailOfferAuditoriumItem from '@/components/virtual-auditorium/DetailOfferAuditoriumItem.vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import type { OfferDto } from '~/types/Offer'
import Album from '~/design-system/ui/album/Album.vue'
const { landingUrl } = useRuntimeConfig().public
const route = useRoute()
const activeTab = ref<string>('info')
const { data: offerDetail } = await useAPI<OfferDto>(
  `/offer-management/get-offer-detail-for-participant?id=${route.params.offerId}`,
  {
    query: {},
    default: () => ({}),
  } as any,
)
offerDetail.value = offerDetail.value
const eventEndDate = offerDetail.value.event
  ? `${dayjs(offerDetail.value.event.endDate).format('DD/MM/YY')} ${dayjs().hour(offerDetail.value.event.closingTime).minute(0).format('hh:mm a')}`
  : ''
const annexesFiles = computed(() => offerDetail.value.annexesFiles || [])
const downloadFile = (filePath: string, fileName: string) => {
  fetch(filePath)
    .then((response) => {
      if (response.ok) {
        return response.blob()
      } else {
        throw new Error('Failed to fetch file')
      }
    })
    .then((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    })
    .catch((error) => {
      alert(`Error: ${error.message}`)
    })
}

// Configuración de imágenes para el carrusel
const attachedMedia = computed(
  () =>
    offerDetail.value.attachedFiles?.map((file) => ({
      src: file.path,
      alt: file.name,
      isVideo: file.path.endsWith('.mp4'),
    })) || [],
)
const selectedMedia = ref(attachedMedia.value[0])
const selectMedia = (media: { src: string; alt: string; isVideo: boolean }) => {
  selectedMedia.value = media
}
const showArrows = computed(() => attachedMedia.value.length > 4)
const isLooping = computed(() => attachedMedia.value.length >= 4)
// const attachedFiles = computed(() => offerDetail.value?.attachedFiles || [])
</script>
<template>
  <ContentLayout
    title="Detalle oferta"
    subtitle="Detalle oferta"
    show-arrow
    custom-class="lg:px-[16px]"
  >
    <div class="flex text-[12px] font-[400] mb-[16px]">
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">
        Auditorio Virtual/
      </h1>
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">
        Mis ofertas/
      </h1>
      <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">
        Detalle de Oferta
      </h1>
    </div>
    <section class="w-full max-w-[1324px] mx-auto h-full">
      <div class="w-full mx-auto grid gap-[16px] mt-[16px] mb-[24px]">
        <div
          class="bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A]"
        >
          <div class="flex flex-wrap justify-between items-center gap-y-[20px]">
            <div>
              <h3
                class="font-[700] text-[#262F45] text-[20px] leading-[28px] mb-[16px]"
              >
                {{ offerDetail.event?.name }}
              </h3>
              <div class="flex items-center">
                <CustomIcons name="calendar-today" class="mb-[1px]" />
                <h3
                  class="gap-x-[6px] text-[#68686C] text-[14px] leading-[20px] ml-[6px] mr-[4px] font-[400]"
                >
                  <span class="font-[700] text-[#20445E] mr-[4px]"
                    >Fecha y hora de cierre
                  </span>
                  {{ eventEndDate }}
                </h3>
                <CustomIcons name="time" class="mb-[1px] stroke-[#20445E]" />
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-x-4 w-auto">
              <NuxtLink
                type="button"
                :href="offerDetail.event?.termsAndConditionsFiles[0]?.path"
                target="_blank"
                class="font-[600] text-sm md:text-base text-[#F97316] bg-white px-4 py-2 rounded hover:bg-[#F97316] hover:text-white"
              >
                Términos y condiciones</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full max-w-[1324px] h-full max-h-[625px] mx-auto">
      <div
        class="h-full md:h-[625px] bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A] mb-[24px]"
      >
        <section class="flex justify-center mx-auto">
          <div class="max-w-7xl w-full">
            <div class="flex flex-col md:flex-row gap-[24px]">
              <!-- Columna Izquierda-->
              <Album
                orientation="vertical"
                :files="offerDetail.attachedFiles"
              />
              <!-- Columna Derecha: Información -->
              <div
                class="w-full h-full min-h-[478px] md:w-[37%] flex flex-col shadow-[0px_0px_4px_0px_#0000001A] p-[16px] rounded-[12px]"
              >
                <!-- Tabs -->
                <div
                  class="flex font-[500] text-[14px] md:text-[16px] gap-4 border-b-[2px] pt-[8px] pb-[16px] border-[#D0D0D1]"
                >
                  <button
                    :class="
                      activeTab === 'info'
                        ? 'text-bluePrimary'
                        : 'text-[#D0D0D1]'
                    "
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                    @click="activeTab = 'info'"
                  >
                    Información
                  </button>
                  <button
                    :class="
                      activeTab === 'description'
                        ? 'text-bluePrimary'
                        : 'text-[#D0D0D1]'
                    "
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                    @click="activeTab = 'description'"
                  >
                    Descripción
                  </button>
                  <button
                    :class="
                      activeTab === 'annex'
                        ? 'text-bluePrimary'
                        : 'text-[#D0D0D1]'
                    "
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                    @click="activeTab = 'annex'"
                  >
                    Anexos
                  </button>
                </div>
                <div>
                  <div v-if="activeTab === 'info'">
                    <DetailOfferAuditoriumItem :offer-detail="offerDetail" />
                  </div>
                  <div v-if="activeTab === 'description'">
                    <p
                      class="my-[16px] text-[14px] text-[#000000] text-justify"
                    >
                      {{ offerDetail.description }}
                    </p>
                  </div>
                  <div v-if="activeTab === 'annex'">
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-[16px] mt-[16px] gap-y-[16px] text-[14px] font-[600] text-[#20445E]"
                    >
                      <div
                        v-for="(file, index) in annexesFiles"
                        :key="file.id"
                        class="text-ellipsis overflow-hidden flex items-center justify-between rounded-[8px] bg-[#F3F8FC] w-full max-w-[389px] h-[70px] p-[12px]"
                      >
                        <p class="truncate-2-lines w-[80%]">{{ file.name }}</p>
                        <button @click="downloadFile(file.path, file.name)">
                          <CustomIcons name="Download-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </ContentLayout>
</template>
<style scoped>
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
