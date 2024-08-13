<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="
      cn('flex items-center gap-y-2 text-center sm:text-left bg-[#F8FAFC] p-4 border-b border-gray-200 sticky top-0 z-10', props.class)
    "
  >
    <slot />
  </div>
</template>
