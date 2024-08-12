<template>
  <main>
    <Header />
    <section class="flex-grow py-4 bg-bgtheme flex flex-col min-h-[calc(100vh_-_80px)]">
      <Sheet>
        <slot />
      </Sheet>
    <ConfirmModal />
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/layouts/Header.vue";
import ConfirmModal from "~/components/ui/confirm-modal/ConfirmModal.vue";
</script>
