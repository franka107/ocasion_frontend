<template>
  <div class="flex items-center gap-4">
    <component
      :is="icons[icon]"
      v-if="icon"
      class="h-5 w-5 text-gray-500 flex-shrink-0"
      aria-hidden="true"
    />
    <span class="text-sm font-medium text-gray-700 min-w-[7rem]">
      {{ label }}
    </span>
    <span v-if="value" class="text-sm font-medium text-gray-900">
      {{ value }}
    </span>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { HashIcon, CoinsIcon, Calendar, Info } from 'lucide-vue-next'

const icons = {
  HashIcon,
  CoinsIcon,
  Calendar,
  Info,
}

const props = defineProps<{
  icon?: keyof typeof icons
  label: string
  value?: string | number
}>()
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí, si es necesario */
</style>
