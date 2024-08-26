<template>
  <div class="relative" :class="{ 'mb-6': !readField }">
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :readonly="readField"
        @input="$emit('update:modelValue', $event.target.value)"
        class="peer w-full min-w-24 h-[56px] px-4 pr-10 text-gray-900 placeholder-transparent border rounded focus:outline-none focus:border-primary focus:border-2 transition-colors duration-300 ease-in-out"
        :placeholder="label"
        :class="{
          'border-red-500': error,
          'border-primary focus:border cursor-default': readField,
        }"
      />
      <slot name="icon-right" />
    </div>
    <label
      :for="id"
      class="absolute left-3 -top-1.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[17px] peer-focus:-top-1.5 peer-focus:text-xs font-inter peer-focus:text-borderPrimaryDark"
      :class="{ 'text-red-500': error }"
    >
      {{ label }}
    </label>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  readField: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const inputType = computed(() => {
  return props.type;
});
</script>
