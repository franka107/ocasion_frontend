<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div class="flex flex-col items-start max-w-md w-full">
        <Logo :subtitle="logoSubtitle" />
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import Logo from './logo.vue'
  
  defineProps({
    logoSubtitle: String
  })
  </script>