<template>
  <ContentLayout title="Gráficos">
    <div class="flex min-h-screen bg-background">
      <!-- Sidebar -->
      <div class="w-64 border-r p-4">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Octubre</h2>
            <div class="flex gap-2">
              <button class="p-2 rounded-md hover:bg-gray-100">
                <ChevronLeft class="h-4 w-4" />
              </button>
              <button class="p-2 rounded-md hover:bg-gray-100">
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-center text-sm">
            <div
              v-for="day in days"
              :key="day"
              class="p-2 text-muted-foreground"
            >
              {{ day }}
            </div>
            <button
              v-for="(date, index) in flatDates"
              :key="index"
              :class="[
                'p-2 rounded-md',
                date === selectedDate
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100',
                date > 31 ? 'text-muted-foreground' : '',
              ]"
              @click="setSelectedDate(date)"
            >
              {{ date }}
            </button>
          </div>
        </div>

        <!-- Events Section -->
        <div class="space-y-4">
          <h2 class="font-semibold">Eventos</h2>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Hoy</span>
              <span class="ml-auto">5</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-rose-500"></div>
              <span>Finaliza</span>
              <span class="ml-auto">4</span>
            </div>
          </div>

          <h3 class="font-semibold">Próximamente</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-gray-500"></div>
              <span>Inicia</span>
              <span class="ml-auto">5</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-gray-500"></div>
              <span>Finaliza</span>
              <span class="ml-auto">4</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-4">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="p-2 rounded-md hover:bg-gray-100">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <h1 class="text-2xl font-bold">10 OCTUBRE 2024</h1>
            <button class="p-2 rounded-md hover:bg-gray-100">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
          <button class="p-2 rounded-md hover:bg-gray-100">
            <Menu class="h-4 w-4" />
          </button>
        </div>

        <!-- Event Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in 5"
            :key="i"
            class="p-4 space-y-4 bg-gray-50 rounded-lg shadow"
          >
            <div class="flex justify-between text-sm">
              <span>Termina:</span>
              <span>02:00:00</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-1">Código del evento</h3>
              <p class="text-sm text-muted-foreground">Organización</p>
            </div>
            <button class="text-orange-500 p-0 h-auto hover:underline">
              Ir al evento
            </button>
          </div>
        </div>
      </div>
    </div>
  </ContentLayout>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Menu } from 'lucide-vue-next'
import ContentLayout from '~/layouts/default/ContentLayout.vue'

const selectedDate = ref(10)

// Calendar data
const days = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
const dates = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, 1, 2, 3, 4],
]

const flatDates = dates.flat()

const setSelectedDate = (date) => {
  selectedDate.value = date
}
</script>

<style scoped>
/* Add your page-specific styles here */
</style>
