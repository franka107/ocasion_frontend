<template>
    <div class="w-[1270px] w-full flex flex-col gap-4 md:flex-row">
      <div
        v-for="(card, index) in cardsData"
        :key="index"
        class="max-w-[356px] max-h-[116px] bg-white p-4 rounded-md flex flex-col "
      >
        <h4 class="text-[16px] text-[#20445E] font-medium">{{ card.subtitle }}</h4>
        <h3 class="text-[22px] text-[#20445E] font-bold">{{ card.amount }}</h3>
        <p class="text-[12px] text-[#86868A]">{{ card.description }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const cardsData = ref([
    {
      subtitle: 'Saldo disponible',
      amount: '$0.00',
      description: 'Saldo que ha cargado y que puede disponer para uso de garantía en participación de eventos.',
    },
    {
      subtitle: 'Saldo garantizado',
      amount: '$0.00',
      description: 'Saldo que está siendo utilizado como garantía para la participación de uno o más eventos (no puede disponerse).',
    },
    {
      subtitle: 'Saldo Total',
      amount: '$0.00',
      description: 'Suma del saldo que tiene el Monedero.',
    },
  ])
  </script>
  
  <style scoped>
  /* Agregar estilos personalizados aquí si es necesario */
  </style>
  