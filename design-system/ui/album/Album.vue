<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FileType } from '~/types/Disbursement'

const props = defineProps<{
  files: FileType[]
  orientation?: 'vertical' | 'horizontal'
}>()

const attachedMedia = computed(() =>
  props.files.map((file) => ({
    src: file.path,
    alt: file.name,
    isVideo: file.path.endsWith('.mp4'),
  })),
)

const selectedMedia = ref(attachedMedia.value[0])

const selectMedia = (media: (typeof attachedMedia.value)[0]) => {
  selectedMedia.value = media
}

// Clases condicionales según la orientación
const containerClass = computed(() => {
  return props.orientation === 'horizontal'
    ? 'flex-row gap-6'
    : 'flex-col-reverse gap-4'
})

const mediaPanelClass = computed(() => {
  return props.orientation === 'horizontal'
    ? 'flex flex-col overflow-x-auto max-h-[480px]'
    : 'flex flex-row overflow-y-auto max-w-full'
})
</script>

<template>
  <div class="flex justify-center w-full max-w-[1440px] mx-auto">
    <section class="flex w-full" :class="containerClass">
      <!-- Panel scrollable -->
      <div
        class="bg-white border border-gray-200 rounded-lg p-4"
        :class="mediaPanelClass"
      >
        <div
          v-for="(media, index) in attachedMedia"
          :key="index"
          class="cursor-pointer"
          @click="selectMedia(media)"
        >
          <div
            class="p-1 rounded-lg transition-colors duration-300"
            :class="{
              'border-2 border-blue-500': media.src === selectedMedia.src,
              'border-transparent': media.src !== selectedMedia.src,
            }"
          >
            <template v-if="media.isVideo">
              <video
                :src="media.src"
                class="w-[65px] h-[50px] object-cover rounded-md"
              ></video>
            </template>
            <template v-else>
              <img
                :src="media.src"
                :alt="media.alt"
                class="w-[65px] h-[50px] object-cover rounded-md"
              />
            </template>
          </div>
        </div>
      </div>

      <!-- Imagen grande -->
      <div class="rounded-lg overflow-hidden w-full max-h-[480px]">
        <template v-if="selectedMedia.isVideo">
          <video
            :src="selectedMedia.src"
            controls
            class="w-full h-[480px] object-cover rounded-lg"
          ></video>
        </template>
        <template v-else>
          <img
            :src="selectedMedia.src"
            :alt="selectedMedia.alt"
            class="w-full h-[480px] object-cover rounded-lg"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilo personalizado para ítems seleccionados */
.carousel-item-active {
  border: 2px solid #3b82f6; /* Azul para ítems seleccionados */
  transition: all 0.3s ease-in-out;
}
</style>
