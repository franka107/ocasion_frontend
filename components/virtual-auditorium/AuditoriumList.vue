<script setup lang="ts">
import AuditoriumListItem from '~/components/virtual-auditorium/AuditoriumListItem.vue'
</script>
<template>
    <section class="flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-[8px] gap-y-[8px] w-full max-w-[901px] ">
         <AuditoriumListItem v-for="card in 8" :key="card"/>
      </div>
    </section>
  </template>
  