<template>
  <div
    class="flex-col hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2"
  >
    <span class="text-sm font-medium text-gray-900">{{
      parsedDate.format('DD-MM-YYYY')
    }}</span>
    <div v-if="!hideTime" class="flex justify-center items-center space-x-1">
      <ClockIcon class="h-3 w-3 text-gray-400" />
      <span class="text-xs text-gray-600">{{
        parsedDate.format('HH:mm')
      }}</span>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { ClockIcon } from 'lucide-vue-next'

const props = defineProps<{
  value: string
  hideTime?: boolean
}>()

const parsedDate = computed(() => dayjs(props.value))
</script>
