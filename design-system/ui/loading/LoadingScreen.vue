<template>
  <div class="loading-screen" :class="$attrs.class">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="pt-2">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = withDefaults(
  defineProps<{
    loadingText?: string
  }>(),
  {
    loadingText: 'Cargando...',
  },
)
</script>

<style scoped>
.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f85d01;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
