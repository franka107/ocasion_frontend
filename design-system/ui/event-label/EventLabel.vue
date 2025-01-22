<script setup lang="tsx">
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import type { EventDto } from '~/types/Event'

interface EventLabelProps {
  event: EventDto
  href: string
  class?: string
}

defineProps<EventLabelProps>()
</script>

<template>
  <div class="flex flex-col space-y-1 py-2 px-2 w-full max-w-[200px]">
    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
      {{ event.id }}
    </span>
    <a
      :href="href"
      target="_blank"
      class="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 ease-in-out truncate"
    >
      {{ event.name }}
    </a>
  </div>
</template>
