<template>
  <div class="bg-white rounded-lg shadow-md p-6 w-full">
    <h2 class="text-2xl font-semibold text-cyan-500 mb-2">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-sm text-[#0E7490] mb-6">
      {{ subtitle }}
    </p>
    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <slot></slot>
      <Button 
        :class="[
          'w-full', 
          submitClass || 'bg-cyan-500 hover:bg-cyan-600'
        ]" 
        type="submit"
      >
        {{ submitText }}
      </Button>
    </form>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

defineProps({
  title: String,
  subtitle: String,
  submitText: String,
  submitClass: String
})

defineEmits(['submit'])
</script>