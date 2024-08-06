<template>
  <div class="bg-white rounded-lg shadow-md p-6 w-full">
    <h2 :class="['text-2xl font-semibold mb-2', titleClass]">
      {{ title }}
    </h2>
    <p v-if="subtitle" :class="['text-sm mb-6', subtitleClass]">
      {{ subtitle }}
    </p>
    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <slot></slot>
      <Button 
        :class="[
          'w-full', 
          submitClass || 'bg-cyan-500 '
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
  submitClass: String,
  titleClass: String,
  subtitleClass: String
})

defineEmits(['submit'])
</script>