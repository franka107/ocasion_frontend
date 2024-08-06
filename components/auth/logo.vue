<template>
    <div class="mb-6 ml-4">
      <img src="/assets/img/logo.png" alt="Deocasión logo" class="h-8 mb-2" />
      <span class="text-sm text-cyan-500">{{ subtitle }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    subtitle: String
  })
  </script>