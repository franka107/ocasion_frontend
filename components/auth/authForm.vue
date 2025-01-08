<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <div
      class="flex flex-col items-center sm:items-start w-full max-w-[572px] mx-auto"
    >
      <!-- Logo con su subtítulo si está presente -->
      <Logo :subtitle="logoSubtitle" />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import Logo from './logo.vue'

defineProps({
  logoSubtitle: String,
})
</script>
