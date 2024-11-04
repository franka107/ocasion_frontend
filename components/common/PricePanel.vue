<template>
  <div class="bg-blue-100 p-4 rounded-lg">
    <div class="flex items-center space-x-4">
      <DollarSign
        class="h-6 w-6 text-blue-500 flex-shrink-0"
        aria-hidden="true"
      />
      <h3 class="text-sm font-medium text-blue-800 flex-grow">
        {{ props.label }}
      </h3>
      <p class="text-lg font-bold text-blue-600 flex-shrink-0">
        $ {{ props.price }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCartIcon, DollarSign } from 'lucide-vue-next'

const props = defineProps<{
  label: string
  price: number
}>()
</script>
