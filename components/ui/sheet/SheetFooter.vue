<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="
      cn(
        'sticky bottom-0 p-4 border-t border-gray-200  bg-white',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
