<template>
  <div>
    <Popover>
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
        <span v-if="dateValue" class="absolute text-[#64748B] bg-white text-xs top-[-8px] left-2 px-1">{{ props.label }}</span>
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            dateValue
              ? dateFormatter.format(dateValue.toDate(getLocalTimeZone()))
              : props.label
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          :minValue="props.minValue"
          :maxValue="props.maxValue"
          @update:modelValue="onUpdateValue"
          v-model="dateValue"
          initial-focus
          :disabled="props.disabled"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import { useVModel } from "@vueuse/core";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import CalendarIcon from "@radix-icons/vue/CalendarIcon";

const dateFormatter = new DateFormatter("es", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

const props = defineProps<{
  label: string;
  class?: string;
  maxValue?: DateValue;
  minValue?: DateValue;
  value: string | undefined;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | undefined): void;
}>();

const modelValue = useVModel(props, "value", emits, {
  passive: true,
  defaultValue: props.value,
});

const dateValue = computed({
  get: () => (modelValue.value ? parseDate(modelValue.value) : undefined),
  set: (val) => {
    modelValue.value = val ? val.toString() : undefined;
  },
});

const onUpdateValue = (newValue: DateValue | undefined) => {
  emits("update:modelValue", newValue ? newValue.toString() : undefined);
};
</script>
