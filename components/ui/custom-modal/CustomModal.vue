<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    icon?: string
  }>(),
  {
    title: '',
    description: '',
    icon: 'AlertIcon',
  },
)
const emit = defineEmits(['update:modelValue', 'close-auto-focus'])
</script>
<template>
  <Dialog
    :open="props.modelValue"
    @update:open="(value) => emit('update:modelValue', value)"
  >
    <DialogContent
      class="sm:max-w-[460px] gap-y-0 max-w-[90%]"
      @close-auto-focus="emit('close-auto-focus')"
    >
      <DialogHeader class="gap-y-0">
        <CustomIcons :name="props.icon" class="mb-4 text-white" />
        <DialogTitle class="text-center mb-3">
          {{ title }}
        </DialogTitle>
      </DialogHeader>
      <slot>
        <p>
          {{ description }}
        </p>
      </slot>
    </DialogContent>
  </Dialog>
</template>
