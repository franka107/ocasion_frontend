<template>
  <main>
    <Header />
    <section class="flex-grow p-4 bg-[#f1f5f9] flex flex-col">
      <slot />
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/layouts/Header.vue";
</script>
