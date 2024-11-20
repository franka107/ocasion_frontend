<template>
  <div class="p-6 bg-white shadow-md rounded-lg">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Módulo de comparación</h2>
      <div class="flex gap-2">
        <button class="p-2 hover:bg-gray-100 rounded-lg">
          <Settings class="w-5 h-5 text-gray-600" />
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-lg">
          <Maximize2 class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <div class="overflow-hidden border border-[#2E7AB8] rounded-lg">
      <table class="min-w-full divide-y divide-[#2E7AB8]">
        <thead class="bg-[#2E7AB8] text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium">
              <!-- Empty header for organization column -->
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="px-4 py-3 text-center text-sm font-medium whitespace-nowrap"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody :key="index" class="bg-white divide divide-y divide-[#2E7AB8]">
          <tr v-for="(org, index) in organizations">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">
              {{ org.name }}
            </td>
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              class="py-3 text-center"
            >
              <div class="divide divide-y w-full divide-[#c8c8c9 ]items-center">
                <span class="text-sm text-gray-900 font-bold">{{
                  org[column.key].value
                }}</span>

                <KpisComponentsPercentageChange
                  :value="org[column.key].percentage"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" tsx>
import { Settings, Maximize2, ArrowUp, ArrowDown } from 'lucide-vue-next'

// // Column definitions
const columns = ref([
  { key: 'events', label: 'Nº eventos', visible: true },
  { key: 'offers', label: 'Nº ofertas', visible: true },
  { key: 'averageTicketOffers', label: 'Ticket prom. ofertas', visible: true },
  { key: 'averageBidOffers', label: 'Pujas prom. ofertas', visible: true },
  {
    key: 'uniqueMonthlyParticipants',
    label: 'N° participantes únicos al mes',
    visible: true,
  },
  { key: 'amountRaised', label: 'Monto recaudado', visible: true },
  {
    key: 'commissionsCollected',
    label: 'Comisiones recaudadas',
    visible: true,
  },
  { key: 'penalties', label: 'Penalidades', visible: true },
  {
    key: 'cancelledOffers',

    label: 'N° ofertas canceladas',
    visible: true,
  },
  { key: 'averageOfferTime', label: 'Tiempo prom. de oferta', visible: true },
])

// Compute visible columns
const visibleColumns = computed(() =>
  columns.value.filter((column) => column.visible),
)

// Toggle column visibility
const toggleColumn = (key) => {
  const column = columns.value.find((col) => col.key === key)
  if (column) {
    column.visible = !column.visible
  }
}
const generateRandomMockedData = (organizationName: string) => {
  const getRandomValue = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  const getRandomPercentage = () => Math.floor(Math.random() * 201) - 100 // Genera un número entre -100 y 100

  return {
    name: organizationName,
    events: {
      value: getRandomValue(1, 100),
      percentage: getRandomPercentage(),
    },
    offers: {
      value: getRandomValue(1, 100),
      percentage: getRandomPercentage(),
    },
    averageTicketOffers: {
      value: getRandomValue(1, 10000),
      percentage: getRandomPercentage(),
    },
    averageBidOffers: {
      value: getRandomValue(1, 10000),
      percentage: getRandomPercentage(),
    },
    uniqueMonthlyParticipants: {
      value: getRandomValue(1, 1000),
      percentage: getRandomPercentage(),
    },
    amountRaised: {
      value: getRandomValue(1000, 1000000),
      percentage: getRandomPercentage(),
    },
    commissionsCollected: {
      value: getRandomValue(100, 100000),
      percentage: getRandomPercentage(),
    },
    penalties: {
      value: getRandomValue(0, 10),
      percentage: getRandomPercentage(),
    },
    cancelledOffers: {
      value: getRandomValue(0, 10),
      percentage: getRandomPercentage(),
    },
    averageOfferTime: {
      value: getRandomValue(1, 30),
      percentage: getRandomPercentage(),
    },
  }
}

// Sample data
const organizations = ref([
  generateRandomMockedData('OnlyDevs'),
  generateRandomMockedData('OnlyDevs2'),
  generateRandomMockedData('MAPFRE'),
])

// Currency formatter
const formatCurrency = (value) => {
  return `$ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`
}
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
