<script setup lang="ts">
defineProps<{
  title: string
  value: string
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <p class="text-center text-sm text-gray-500">{{ title }}</p>
    <p class="text-center text-lg font-bold">{{ value }}</p>
  </div>
</template>
