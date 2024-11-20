<script setup lang="ts">
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import ChartMetrics from '~/layouts/default/ChartMetrics.vue';

interface Props {
  isOpen: boolean
  title: string
  modalChartId: string
  chartMetrics?: {
    label: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
  }[];
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const handleClose = () => {
  emit('close')
  emit('update:isOpen', false)
}
</script>

<template>
  <DialogRoot :open="isOpen" modal @update:open="handleClose">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 bg-black/30 backdrop-blur-sm
               transition-opacity duration-200 ease-in-out
               data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
        aria-hidden="true"
      />
      <DialogContent
        class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               w-full max-w-[95%] md:max-w-[90%] lg:max-w-4xl
               bg-white rounded-lg p-4 md:p-6 shadow-lg
               transition-all duration-200 ease-in-out
               data-[state=open]:opacity-100 data-[state=open]:scale-100
               data-[state=closed]:opacity-0 data-[state=closed]:scale-95"
      >
        <div class="flex justify-between items-center mb-4">
          <DialogTitle class="text-base md:text-lg lg:text-xl font-medium truncate">
            {{ title }}
          </DialogTitle>

          <DialogClose
            class="text-gray-500 hover:text-gray-700 ml-2 rounded-full
                   hover:bg-gray-100 p-1 transition-colors duration-200"
            @click="handleClose"
          >
            <CustomIcons name="Close" class="w-4 h-4" />
            <span class="sr-only">Cerrar</span>
          </DialogClose>
        </div>
        <ChartMetrics :metrics="chartMetrics" />
        <div class="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[427px]">
          <canvas :id="modalChartId"></canvas>
        </div>

      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
