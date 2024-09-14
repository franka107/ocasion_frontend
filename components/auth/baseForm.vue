<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 w-[572px] transition-all duration-300 ease-in-out"
  >
    <h2
      :class="[
        'text-[40px] font-roboto font-semibold  text-[#20445e]',
        titleClass,
      ]"
    >
      {{ title }}
    </h2>
    <p v-if="subtitle" :class="['text-sm mb-6', subtitleClass]">
      {{ subtitle }}
    </p>
    <form @submit.prevent="$emit('submit')">
      <div>
        <slot></slot>
      </div>
      <div
        :class="[
          'mt-4 transition-all duration-300 ease-in-out',
          showPasswordRequirements ? 'mb-16' : 'mb-4',
        ]"
      >
        <button
          :class="[
            'w-full',
            'h-[54px]',
            isActive && !isLoading
              ? 'bg-primary text-white'
              : 'bg-[#f1f5f9] text-[#95aab9]', // Fondo cuando está habilitado o deshabilitado
            'rounded-btn',
            'gap-8',
            'flex',
            'font-semibold',
            'items-center',
            'justify-center',
            'cursor-pointer',
          ]"
          :disabled="!isActive && !isLoading"
          type="submit"
        >
          {{ submitText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  subtitle: String,
  submitText: String,
  submitClass: String,
  titleClass: String,
  subtitleClass: String,
  showPasswordRequirements: Boolean,
  isActive: Boolean,
  isLoading: Boolean,
});
</script>
