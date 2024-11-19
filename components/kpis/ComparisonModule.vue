<template>
  <div class="p-6 bg-white">
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

    <div class="overflow-hidden border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#2E7AB8] text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium">
              <!-- Empty header for organization column -->
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium">
              Nº eventos
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium">
              Nº ofertas
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-medium whitespace-nowrap"
            >
              Pujas prom. ofertas
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-medium whitespace-nowrap"
            >
              Nº participantes únicos al mes
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium">
              Monto recaudado
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium">
              Comisiones recaudadas
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(org, index) in organizations"
            :key="index"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-900">
              {{ org.name }}
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{ org.events }}</span>
                <PercentageChange :value="org.eventsChange" />
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{ org.offers }}</span>
                <PercentageChange :value="org.offersChange" />
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{ org.avgBids }}</span>
                <PercentageChange :value="org.avgBidsChange" />
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{
                  formatCurrency(org.participants)
                }}</span>
                <PercentageChange :value="org.participantsChange" />
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{
                  formatCurrency(org.amount)
                }}</span>
                <span class="text-sm text-gray-500"
                  >{{ org.amountChange }}%</span
                >
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex flex-col items-center">
                <span class="text-sm text-gray-900">{{
                  formatCurrency(org.commission)
                }}</span>
                <PercentageChange :value="org.commissionChange" />
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

// Percentage Change Component
const PercentageChange = defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const isPositive = computed(() => props.value >= 0)
    const color = computed(() =>
      isPositive.value ? 'text-green-500' : 'text-red-500',
    )
    const Icon = computed(() => (isPositive.value ? ArrowUp : ArrowDown))

    return () => (
      <div class={`flex items-center gap-1 ${color.value} text-xs`}>
        <Icon.value class="w-3 h-3" />
        <span>{Math.abs(props.value)}%</span>
      </div>
    )
  },
})

// Sample data
const organizations = ref([
  {
    name: 'Organización 1',
    events: '00',
    eventsChange: -0,
    offers: '00',
    offersChange: 0,
    avgBids: '00',
    avgBidsChange: -0,
    participants: 1000.0,
    participantsChange: 0,
    amount: 1000.0,
    amountChange: 0,
    commission: 1000.0,
    commissionChange: -0,
  },
  {
    name: 'Organización 2',
    events: '00',
    eventsChange: -0,
    offers: '00',
    offersChange: 0,
    avgBids: '00',
    avgBidsChange: -0,
    participants: 1000.0,
    participantsChange: 0,
    amount: 1000.0,
    amountChange: 0,
    commission: 1000.0,
    commissionChange: -0,
  },
  {
    name: 'Organización 3',
    events: '00',
    eventsChange: -0,
    offers: '00',
    offersChange: 0,
    avgBids: '00',
    avgBidsChange: -0,
    participants: 1000.0,
    participantsChange: 0,
    amount: 1000.0,
    amountChange: 0,
    commission: 1000.0,
    commissionChange: -0,
  },
])

// Currency formatter
const formatCurrency = (value) => {
  return `$ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`
}
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
