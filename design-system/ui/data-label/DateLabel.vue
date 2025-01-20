<template>
  <div class="flex flex-col justify-center h-full">
    <span class="text-sm font-medium text-gray-900">{{
      parsedDate.format('DD-MM-YYYY')
    }}</span>
    <div class="flex items-center space-x-1">
      <ClockIcon class="h-3 w-3 text-gray-400" />
      <span class="text-xs text-gray-600">{{
        parsedDate.format('HH:mm')
      }}</span>
    </div>
  </div>
</template>

<script setup lang="tsx">
import dayjs from 'dayjs'
import { ClockIcon } from 'lucide-vue-next'

const props = defineProps<{
  value: string
}>()

const parsedDate = dayjs(props.value)
</script>
