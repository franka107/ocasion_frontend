<template>
  <div>
    <Popover>
      <div class="mb-[6px]">
        <label
          v-if="props.staticLabel"
          :class="[
            'text-4 font-[500]',
            props.disabled ? 'opacity-50 ' : 'text-[#0F172A]',
          ]"
          >{{ props.label }}</label
        >
      </div>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="[
            'w-full justify-start text-left font-normal relative border-[#0B3859]',
            !modelValue && 'text-[#94A3B8]',
            props.class,
          ]"
          :disabled="props.disabled"
        >
          <span
            v-if="dateValue && !staticLabel"
            class="absolute text-[#64748B] bg-white text-xs top-[-8px] left-2 px-1"
            >{{ props.label }}</span
          >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            dateValue
              ? dateFormatter.format(dateValue.toDate(getLocalTimeZone()))
              : props.label
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="z-[200] w-auto p-0">
        <Calendar
          v-model="dateValue"
          locale="es"
          :min-value="props.minValue"
          :max-value="props.maxValue"
          :is-date-disabled="props.isDateDisabled"
          initial-focus
          :disabled="props.disabled"
          @update:model-value="onUpdateValue"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue,
} from '@internationalized/date'
import CalendarIcon from '@radix-icons/vue/CalendarIcon'

const dateFormatter = new DateFormatter('es', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
})

const props = withDefaults(
  defineProps<{
    label: string
    class?: string
    maxValue?: DateValue
    minValue?: DateValue
    staticLabel?: boolean
    isDateDisabled?: (date: DateValue) => boolean
    value: string | undefined
    disabled?: boolean
  }>(),
  { staticLabel: false },
)

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | undefined): void
}>()

const modelValue = useVModel(props, 'value', emits, {
  passive: true,
  defaultValue: props.value,
})

const dateValue = computed({
  get: () => (modelValue.value ? parseDate(modelValue.value) : undefined),
  set: (val) => {
    modelValue.value = val ? val.toString() : undefined
  },
})

const onUpdateValue = (newValue: DateValue | undefined) => {
  emits('update:modelValue', newValue ? newValue.toString() : undefined)
}
</script>
