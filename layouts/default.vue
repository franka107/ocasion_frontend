<template>
  <main>
    <Header />
    <section class="flex-grow p-4 bg-bgtheme flex flex-col min-h-[calc(100vh_-_80px)]">
      <Sheet>
        <slot />
      </Sheet>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/layouts/Header.vue";
</script>
