<template>
  <div class="p-6 bg-white shadow-md rounded-lg">
    <!-- Header section con mejor espaciado -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h2 class="text-xl font-semibold text-gray-900">Módulo de comparación</h2>
      <div class="flex gap-3">
        <!-- Settings Popover -->
        <div class="relative">
          <button
            @click="isSettingsOpen = !isSettingsOpen"
            class="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            ref="settingsButtonRef"
          >
            <Settings class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Settings Menu con mejor padding -->
          <nav
            v-show="isSettingsOpen"
            id="settings-menu"
            class="absolute mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 settings-menu
                   left-0 sm:left-auto sm:right-0"
            aria-label="Column settings"
          >
            <fieldset class="p-4 space-y-3">
              <legend class="sr-only">Visible columns</legend>
              <div
                v-for="column in columns"
                :key="column.key"
                class="flex items-center space-x-3"
              >
                <label class="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :id="column.key"
                    v-model="column.visible"
                    class="hidden"
                    :aria-label="`Show ${column.label} column`"
                  />
                  <span
                    class="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center"
                    :class="{ 'border-primary-950 bg-white': column.visible }"
                    role="checkbox"
                    :aria-checked="column.visible"
                  >
                    <svg
                      v-show="column.visible"
                      class="w-4 h-4 text-primary-950"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span class="ml-3 text-sm text-gray-700">
                    {{ column.label }}
                  </span>
                </label>
              </div>
            </fieldset>
          </nav>
        </div>

        <button
          @click="isModalOpen = true"
          class="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Maximize2 class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Tabla con mejor espaciado -->
    <div class="relative">
      <div class="overflow-x-auto pb-4">
        <div class="min-w-fit border border-[#2E7AB8] rounded-lg">
          <table class="w-full divide-y divide-[#2E7AB8]">
            <thead class="bg-[#2E7AB8] text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium">
                  <!-- Empty header for organization column -->
                </th>
                <th
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="px-6 py-4 text-center text-sm font-medium whitespace-nowrap"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-[#2E7AB8]">
              <tr
                v-for="(org, index) in organizations"
                :key="index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ org.name }}
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  class="py-4 text-center"
                >
                  <div class="w-full space-y-2">
                    <span class="text-sm text-gray-900 font-bold block px-6">
                      {{ org[column.key].value }}
                    </span>
                    <KpisComponentsPercentageChange
                      :value="org[column.key].percentage"
                      class="text-sm"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal con mejor espaciado -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="isModalOpen = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-900">Módulo de comparación</h3>
          <button
            @click="isModalOpen = false"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <!-- Modal Body con la misma tabla pero mejor espaciado -->
        <div class="overflow-auto p-6">
          <div class="px-4">
            <div class="border border-[#2E7AB8] rounded-lg">
              <table class="w-full divide-y divide-[#2E7AB8]">
                <thead class="bg-[#2E7AB8] text-white">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-medium">
                    </th>
                    <th
                      v-for="column in visibleColumns"
                      :key="column.key"
                      class="px-6 py-4 text-center text-sm font-medium whitespace-nowrap"
                    >
                      {{ column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-[#2E7AB8]">
                  <tr
                    v-for="(org, index) in organizations"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">
                      {{ org.name }}
                    </td>
                    <td
                      v-for="column in visibleColumns"
                      :key="column.key"
                      class="py-4 text-center"
                    >
                      <div class="w-full space-y-2">
                        <span class="text-sm text-gray-900 font-bold block px-6">
                          {{ org[column.key].value }}
                        </span>
                        <KpisComponentsPercentageChange
                          :value="org[column.key].percentage"
                          class="text-sm"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Settings, Maximize2, X } from 'lucide-vue-next'

const isSettingsOpen = ref(false)
const isModalOpen = ref(false)
const settingsButtonRef = ref<HTMLButtonElement | null>(null)

const columns = ref([
  { key: 'events', label: 'Nº eventos', visible: true },
  { key: 'offers', label: 'Nº ofertas', visible: true },
  { key: 'averageTicketOffers', label: 'Ticket prom. ofertas', visible: true },
  { key: 'averageBidOffers', label: 'Pujas prom. ofertas', visible: true },
  { key: 'uniqueMonthlyParticipants', label: 'N° participantes únicos al mes', visible: true },
  { key: 'amountRaised', label: 'Monto recaudado', visible: true },
  { key: 'commissionsCollected', label: 'Comisiones recaudadas', visible: true },
  { key: 'penalties', label: 'Penalidades', visible: true },
  { key: 'cancelledOffers', label: 'N° ofertas canceladas', visible: true },
  { key: 'averageOfferTime', label: 'Tiempo prom. de oferta', visible: true },
])

const visibleColumns = computed(() =>
  columns.value.filter((column) => column.visible)
)

const generateRandomMockedData = (organizationName: string) => {
  const getRandomValue = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  const getRandomPercentage = () => Math.floor(Math.random() * 201) - 100

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

const organizations = ref([
  generateRandomMockedData('OnlyDevs'),
  generateRandomMockedData('OnlyDevs2'),
  generateRandomMockedData('MAPFRE'),
])

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.settings-menu') && target !== settingsButtonRef.value) {
    isSettingsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
