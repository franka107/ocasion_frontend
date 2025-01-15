<script setup lang="ts">
import { watchOnce } from '@vueuse/core'
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { FileType } from '~/types/Disbursement'

const props = withDefaults(
  defineProps<{
    files: FileType[]
    orientation?: 'vertical' | 'horizontal'
  }>(),
  { orientation: 'horizontal' },
)

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  emblaMainApi.value.scrollTo(index)
}

function isVideoFile(url: string): boolean {
  // Definimos un conjunto de extensiones de video aceptadas
  const videoExtensions = [
    'mp4',
    'mkv',
    'avi',
    'mov',
    'flv',
    'wmv',
    'webm',
    'mpeg',
    '3gp',
  ]

  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const extension = pathname.split('.').pop()?.toLowerCase()

    return !!extension && videoExtensions.includes(extension)
  } catch (error) {
    return false
  }
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return

  onSelect()
  emblaMainApi.on('select', onSelect)
  emblaMainApi.on('reInit', onSelect)
})

const containerClass = computed(() => {
  return props.orientation === 'horizontal'
    ? 'flex flex-row-reverse gap-6'
    : 'flex flex-col gap-4'
})

const mediaPanelClass = computed(() => {
  return props.orientation === 'horizontal'
    ? 'h-full max-w-[100px]'
    : 'w-full max-w-xs'
})
</script>

<template>
  <div :class="[containerClass, $attrs.class]">
    <Carousel class="relative w-full" @init-api="(val) => (emblaMainApi = val)">
      <CarouselContent>
        <CarouselItem v-for="(file, index) in files" :key="index">
          <!-- <div class="p-1"> -->
          <!--   <Card> -->
          <!--     <CardContent -->
          <!--       class="flex aspect-square items-center justify-center p-6" -->
          <!--     > -->
          <!--       <span class="text-4xl font-semibold">{{ index + 1 }}</span> -->
          <!--     </CardContent> -->
          <!--   </Card> -->
          <!-- </div> -->

          <div class="p-1 rounded-lg overflow-hidden w-full max-h-[480px]">
            <template v-if="isVideoFile(file.path)">
              <video
                :src="file.path"
                controls
                class="w-full h-[480px] object-cover rounded-lg"
              ></video>
            </template>
            <template v-else>
              <img
                :src="file.path"
                :alt="file.name"
                class="w-full h-[480px] object-cover rounded-lg"
              />
            </template>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="left-2" />
      <CarouselNext class="right-2" />
    </Carousel>

    <Carousel
      :class="['relative', mediaPanelClass]"
      :orientation="orientation === `vertical` ? `horizontal` : 'vertical'"
      @init-api="(val) => (emblaThumbnailApi = val)"
    >
      <CarouselContent class="flex gap-1 ml-0">
        <CarouselItem
          v-for="(file, index) in files"
          :key="index"
          class="pl-0 basis-1/4 cursor-pointer"
          @click="onThumbClick(index)"
        >
          <!-- <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'"> -->
          <!--   <Card> -->
          <!--     <CardContent -->
          <!--       class="flex aspect-square items-center justify-center p-6" -->
          <!--     > -->
          <!--       <span class="text-4xl font-semibold">{{ index + 1 }}</span> -->
          <!--     </CardContent> -->
          <!--   </Card> -->
          <!-- </div> -->

          <div
            class="p-1 rounded-lg overflow-hidden w-full"
            :class="index === selectedIndex ? '' : 'opacity-50'"
          >
            <template v-if="isVideoFile(file.path)">
              <video
                :src="file.path"
                controls
                class="w-full object-cover rounded-lg"
              ></video>
            </template>
            <template v-else>
              <img
                :src="file.path"
                :alt="file.name"
                class="w-full object-cover rounded-lg"
              />
            </template>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>
