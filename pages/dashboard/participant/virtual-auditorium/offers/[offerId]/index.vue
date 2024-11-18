<script setup lang="ts">
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
import dayjs from 'dayjs'
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
    showArrow
    customClass="lg:px-[16px]"
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
        <section class="flex justify-center mx-auto max-w-[1116px]">
          <div class="max-w-7xl w-full">
            <div class="flex flex-col md:flex-row gap-[24px]">
              <!-- Columna Izquierda-->
              <div class="flex flex-col justify-center w-full md:w-[63%]">
                <div class="w-full" style="max-width: 692px">
                  <div
                    class="w-full h-full max-w-[692px] max-h-[480px] rounded-2xl overflow-hidden"
                  >
                    <template v-if="selectedMedia.isVideo">
                      <video
                        :src="selectedMedia.src"
                        controls
                        class="w-full h-full object-cover"
                      ></video>
                    </template>
                    <template v-else>
                      <img
                        :src="selectedMedia.src"
                        :alt="selectedMedia.alt"
                        class="w-full h-full object-cover"
                      />
                    </template>
                  </div>
                </div>
                <div class="flex w-full items-center" style="max-width: 692px">
                  <div
                    class="flex justify-center md:w-full w-[62vw] mt-[16px] mx-auto"
                  >
                    <Carousel
                      class="relative w-full max-w-xs h-auto md:h-[52%]"
                      :opts="{ align: 'start', loop: isLooping }"
                    >
                      <CarouselContent>
                        <CarouselItem
                          v-for="(media, index) in attachedMedia"
                          :key="index"
                          :class="{
                            'basis-1/4': attachedMedia.length > 3,
                            'basis-1/3':
                              attachedMedia.length <= 3 &&
                              attachedMedia.length > 1,
                            'basis-1/1': attachedMedia.length <= 1,
                          }"
                        >
                          <div class="p-1" @click="selectMedia(media)">
                            <Card class="rounded-[0px]">
                              <CardContent class=" p-0">
                                <template v-if="media.isVideo">
                                  <video
                                    :src="media.src"
                                    class="w-full h-full object-cover max-w-[65px] max-h-[50px] rounded-0"
                                  ></video>
                                </template>
                                <template v-else>
                                  <img
                                    :src="media.src"
                                    :alt="media.alt"
                                    class="w-[65px] h-[50px] object-cover rounded-0"
                                  />
                                </template>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious v-if="showArrows" />
                      <CarouselNext v-if="showArrows" />
                    </Carousel>
                  </div>
                </div>
              </div>
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
                    @click="activeTab = 'info'"
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                  >
                    Información
                  </button>
                  <button
                    :class="
                      activeTab === 'description'
                        ? 'text-bluePrimary'
                        : 'text-[#D0D0D1]'
                    "
                    @click="activeTab = 'description'"
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                  >
                    Descripción
                  </button>
                  <button
                    :class="
                      activeTab === 'annex'
                        ? 'text-bluePrimary'
                        : 'text-[#D0D0D1]'
                    "
                    @click="activeTab = 'annex'"
                    class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]"
                  >
                    Anexos
                  </button>
                </div>
                <div>
                  <div v-if="activeTab === 'info'">
                    <DetailOfferAuditoriumItem :offerDetail="offerDetail" />
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

