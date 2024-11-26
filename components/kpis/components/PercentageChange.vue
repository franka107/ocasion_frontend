<script setup lang="ts">
import { computed } from 'vue'
import {
  Settings,
  Maximize2,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-vue-next'

const props = defineProps<{
  value: number
}>()

const isPositive = computed(() => props.value >= 0)
const color = computed(() =>
  isPositive.value ? 'text-green-500' : 'text-red-500',
)
const Icon = computed(() => (isPositive.value ? ChevronUp : ChevronDown))
</script>

<template>
  <div
    :class="`flex items-center justify-center gap-1 ${color} text-sm font-bold`"
  >
    <Icon class="w-3 h-3" />
    <span>{{ Math.abs(props.value) }}%</span>
  </div>
</template>
