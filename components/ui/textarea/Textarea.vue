<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import {
  type InputVariants,
  inputVariant,
  labelVariant,
} from '@/components/ui/custom-input/index.js'

const props = withDefaults(
  defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    label?: string
    size?: InputVariants['size']
    class?: HTMLAttributes['class']
    type?: string
    readonly?: boolean
  }>(),
  {
    size: 'base',
    type: 'text',
    readonly: false,
    disabled: false,
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
const active = ref(false)
const isFocus = ref(false)

watch(
  [modelValue, isFocus],
  () => {
    active.value = isFocus.value || !!modelValue.value
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative">
    <label
      :for="label"
      :class="
        cn(
          labelVariant({ size }),
          active
            ? `text-[#64748B] text-xs ${size === 'base' ? 'translate-y-[-12px]' : 'translate-y-[-24px]'}`
            : 'text-[#94A3B8] mt-[10px]',
        )
      "
      >{{ label }}</label
    >
    <textarea
      v-model="modelValue"
      :readonly="readonly"
      :class="
        cn(
          'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
  </div>
</template>
