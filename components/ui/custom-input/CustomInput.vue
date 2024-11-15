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
    staticLabel?: boolean;
    showTooltip?: boolean; 
    tooltipContent?: string;
    showPasswordIcon?: boolean; 
  }>(),
  {
    size: "base",
    type: "text",
    readonly: false,
    disabled: false,
    labelOffset: false,
    staticLabel: false,
    showTooltip: false, 
    tooltipContent: "",
    showPasswordIcon: false,
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
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

</script>

<template>
  <div :class="[
      'relative',
      { 'flex flex-col gap-y-1.5 ': props.staticLabel, 'flex items-center': !props.staticLabel }
    ]">
     <label
      v-if="props.staticLabel"
      for="staticLabel"
      :class="[
        'text-4 font-[500]',
        props.disabled ? 'opacity-50 ' : 'text-[#0F172A]',
        'flex items-center' // Para colocar el tooltip al lado del label
      ]"
    >
      {{ label }}
      <span class="text-[#F6313C] ml-1">*</span>
      
      <!-- Mostrar el tooltip solo si showTooltip es true -->
      <div v-if="props.showTooltip && props.tooltipContent" class="ml-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" class="border-none p-0">
                <CustomIcons name="info" class="w-4 h-4 text-[#2872A1]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              class="w-[414px] px-[13px] bg-[#F3F8FC] "
            >
              <ul class="text-[14px] text-[#152A3C] leading-[20px]">
                <li v-for="(item, index) in tooltipContent.split('\n')" :key="index">
                  {{ item.trim() }}
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </label>
    <label
       v-else
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
    <template v-if="props.showPasswordIcon">
      <div class="relative">
        <input
          v-model="modelValue"
          :name="label"
          @focus="isFocus = true"
          @blur="isFocus = false"
          :type="type === 'password' ? (showPassword ? 'text' : 'password') : type"
          :readonly="readonly"
          :disabled="disabled"
          :class="cn(inputVariant({ size }), 'pr-10', props.class)"
        >

        <!-- Icono de ojo para contraseñas -->
        <span
          @click="togglePasswordVisibility"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          <CustomIcons :name="showPassword ? 'EyeIcon' : 'EyeIconClosed'" class="w-5 h-5 text-gray-400" />
        </span>

        <!-- Icono derecho -->
        <span
          v-if="$slots.iconRight"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <slot name="iconRight"></slot>
        </span>
      </div>
    </template>

    <!-- Si no se muestra showPasswordIcon, renderizar input directamente -->
    <template v-else>
      <input
        v-model="modelValue"
        :name="label"
        @focus="isFocus = true"
        @blur="isFocus = false"
        :type="type"
        :readonly="readonly"
        :disabled="disabled"
        :class="cn(inputVariant({ size }), props.class)"
      >

      <!-- Icono derecho si está presente -->
      <span
        v-if="$slots.iconRight"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        <slot name="iconRight"></slot>
      </span>
    </template>
  </div>
  <!-- <div class="relative flex items-center"> -->
  <!--   <label :for="label" :class="cn(labelVariant({ size }), active  -->
  <!--   ? `text-[#64748B] text-xs ${props.labelOffset ? 'translate-y-[-26px]' : size === 'base' ? 'translate-y-[-20px]' : 'translate-y-[-24px]'}` -->
  <!--   : 'text-[#94A3B8]')">{{ label }}</label> -->
  <!--   <input v-model="modelValue" :name="label" @focus="isFocus = true" @blur="isFocus = false" :type="type" :readonly="readonly" :disabled="disabled" :class="cn(inputVariant({ size }), props.class)"> -->
  <!-- </div> -->
</template>
