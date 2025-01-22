<script setup lang="tsx">
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import type { OfferDto } from '~/types/Offer'

interface OfferLabelProps {
  offer: OfferDto
  href: string
  class?: string
}

defineProps<OfferLabelProps>()
</script>

<template>
  <div class="flex flex-col space-y-1 py-2 px-2 w-full max-w-[200px]">
    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
      {{ offer.id }}
    </span>
    <RouterLink
      :to="href"
      class="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 ease-in-out truncate"
    >
      {{ offer.title }}
    </RouterLink>
  </div>
</template>
