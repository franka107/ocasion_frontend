<template>
  <div class="mb-6 relative">
    <input 
      :id="id"
      :type="inputType"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="peer w-[524px] h-[56px] px-3 pr-10 text-gray-900 placeholder-transparent border rounded focus:outline-none 
        focus:ring-2 focus:ring-borderPrimaryDark focus:border-transparent
        transition-all duration-300 ease-in-out"
      :placeholder="label"
      :class="{ 'border-red-500': error }"
    />
    <label 
      :for="id"
      class="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all 
        peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
        peer-focus:-top-2.5 peer-focus:text-custom-12 font-inter peer-focus:text-borderPrimaryDark"
        :class="{ 'text-red-500': error }"
    >
      {{ label }}
    </label>
    <button
      v-if="props.type === 'password'"
      @click="togglePassword"
      type="button"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
    >
      <EyeClosedIcon v-if="!showPassword" class="h-5 w-5 text-black" />
      <EyeOpenIcon v-else class="h-5 w-5 text-black" />
    </button>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-icons/vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});
</script>
