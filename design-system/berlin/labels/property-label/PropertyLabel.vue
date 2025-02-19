<script setup lang="tsx">
defineProps<{
  label: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1 text-sm">
    <span class="font-semibold text-gray-800">{{ label }}</span>
    <span class="text-gray-600">{{ description }}</span>
  </div>
</template>
<style scoped>
/* Ajusta los estilos si lo necesitas */
</style>
