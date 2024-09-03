<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { type InputVariants, inputVariant, labelVariant } from '.'

const props = withDefaults(defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  label?: string
  size?: InputVariants['size']
  class?: HTMLAttributes['class']
  type?: string
  readonly?: boolean
}>(),{
  size: 'base',
  type: 'text',
  readonly: false,
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
const active = ref(false)
const isFocus = ref(false)
watch([modelValue, isFocus], () => {
  if (isFocus.value) {
    active.value = true
    return
  }
  active.value = (!!modelValue.value)
}, { immediate: true })
</script>

<template>
  <div class="relative flex items-center">
    <label :for="label" :class="cn(labelVariant({ size }), active ? `text-[#64748B] text-xs ${size === 'base' ? 'translate-y-[-20px]' : 'translate-y-[-24px]'}`: 'text-[#94A3B8]')">{{ label }}</label>
    <input v-model="modelValue" :name="label" @focus="isFocus = true" @blur="isFocus = false" :type="type" :readonly="readonly" :class="cn(inputVariant({ size }), props.class)">
  </div>
</template>
