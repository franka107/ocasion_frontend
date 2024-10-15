<template>
  <div>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
      <DialogContent class="sm:max-w-[425px] rounded-lg">
        <div class="flex flex-col items-center text-center">
          <div :class="[iconBgColor, 'rounded-full p-3 mb-4']">
            <img :src="iconSrc" :alt="iconAlt" class="w-6 h-5 text-white" />
          </div>
          <DialogTitle class="text-xl font-bold text-[#09314F] mb-2">{{
            title
          }}</DialogTitle>
          <DialogDescription class="text-gray-600 mb-6">
            {{ description }}
            <p class="mt-2">{{ subDescription }}</p>
          </DialogDescription>
          <Button
            class="w-40 bg-[#09314F] hover:bg-[#09314F] text-white rounded py-2"
            @click="handleAction"
          >
            {{ buttonText }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps({
  open: Boolean,
  iconSrc: String,
  iconAlt: String,
  title: String,
  description: String,
  subDescription: String,
  buttonText: String,
  iconBgColor: {
    type: String,
    default: 'bg-[#2872A1]', // Color por defecto
  },
})

const emit = defineEmits(['update:open', 'close', 'action'])

const closeDialog = () => {
  emit('update:open', false)
  emit('close')
}

const handleAction = () => {
  closeDialog()
  emit('action')
}
</script>
