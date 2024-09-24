<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";
import { type InputVariants, inputVariant, labelVariant } from ".";

const props = withDefaults(
  defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    label?: string;
    size?: InputVariants["size"];
    class?: HTMLAttributes["class"];
    type?: string;
    readonly?: boolean;
    disabled?: boolean;
    labelOffset?: boolean;
  }>(),
  {
    size: "base",
    type: "text",
    readonly: false,
    disabled: false,
    labelOffset: false,
  },
);

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
const active = ref(false);
const isFocus = ref(false);
watch(
  [modelValue, isFocus],
  () => {
    if (isFocus.value) {
      active.value = true;
      return;
    }
    //active.value = !!modelValue.value;
    active.value =
      modelValue.value !== undefined &&
      modelValue.value !== null &&
      modelValue.value !== "";
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative flex items-center">
    <label
      :for="label"
      :class="
        cn(
          labelVariant({ size }),
          active
            ? `text-[#64748B] text-xs ${props.labelOffset ? 'translate-y-[-26px]' : size === 'base' ? 'translate-y-[-20px]' : 'translate-y-[-24px]'}`
            : 'text-[#94A3B8]',
        )
      "
      >{{ label }}</label
    >
    <input
      v-model="modelValue"
      :name="label"
      @focus="isFocus = true"
      @blur="isFocus = false"
      :type="type"
      :readonly="readonly"
      :disabled="disabled"
      :class="cn(inputVariant({ size }), 'pr-10', props.class)"
    />
    <!-- Icono derecho -->

    <span
      v-if="$slots.iconRight"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
    >
      <slot name="iconRight"></slot>
    </span>
  </div>
  <!-- <div class="relative flex items-center"> -->
  <!--   <label :for="label" :class="cn(labelVariant({ size }), active  -->
  <!--   ? `text-[#64748B] text-xs ${props.labelOffset ? 'translate-y-[-26px]' : size === 'base' ? 'translate-y-[-20px]' : 'translate-y-[-24px]'}` -->
  <!--   : 'text-[#94A3B8]')">{{ label }}</label> -->
  <!--   <input v-model="modelValue" :name="label" @focus="isFocus = true" @blur="isFocus = false" :type="type" :readonly="readonly" :disabled="disabled" :class="cn(inputVariant({ size }), props.class)"> -->
  <!-- </div> -->
</template>
