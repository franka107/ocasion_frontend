<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue';
import Chart, { Legend, plugins } from 'chart.js/auto'
import ChartModal from './ChartModal.vue';

interface MonthlyData {
  month: string;
  published: number;
  inProgress: number;
  cancelled: number;
  finished: number;
  completed: number;
  eventAmount: number;
  searchAmount: number;
}


const monthlyData = ref<MonthlyData[]>([
  {
    month: 'January',
    published: -20,
    inProgress: -30,
    cancelled: 40,
    finished: 30,
    completed: 20,
    eventAmount: 65,
    searchAmount: 90
  },
  {
    month: 'February',
    published: 0,
    inProgress: 20,
    cancelled: 0,
    finished: 60,
    completed: 40,
    eventAmount: 60,
    searchAmount: 70
  },
  {
    month: 'March',
    published: 10,
    inProgress: 30,
    cancelled: 5,
    finished: 50,
    completed: 45,
    eventAmount: 80,
    searchAmount: 85
  },
  {
    month: 'April',
    published: 20,
    inProgress: 10,
    cancelled: 10,
    finished: 70,
    completed: 60,
    eventAmount: 90,
    searchAmount: 100
  },
  {
    month: 'May',
    published: -10,
    inProgress: 5,
    cancelled: 15,
    finished: 40,
    completed: 30,
    eventAmount: 75,
    searchAmount: 80
  },
  {
    month: 'June',
    published: 5,
    inProgress: 10,
    cancelled: 0,
    finished: 65,
    completed: 55,
    eventAmount: 85,
    searchAmount: 90
  },
  {
    month: 'July',
    published: 15,
    inProgress: 20,
    cancelled: 10,
    finished: 80,
    completed: 70,
    eventAmount: 95,
    searchAmount: 110
  },
  {
    month: 'August',
    published: 0,
    inProgress: 25,
    cancelled: 5,
    finished: 90,
    completed: 75,
    eventAmount: 100,
    searchAmount: 120
  },
  {
    month: 'September',
    published: 10,
    inProgress: 30,
    cancelled: 0,
    finished: 85,
    completed: 65,
    eventAmount: 110,
    searchAmount: 130
  },
  {
    month: 'October',
    published: -5,
    inProgress: 15,
    cancelled: 10,
    finished: 60,
    completed: 50,
    eventAmount: 95,
    searchAmount: 115
  },
  {
    month: 'November',
    published: 5,
    inProgress: 20,
    cancelled: 0,
    finished: 75,
    completed: 65,
    eventAmount: 105,
    searchAmount: 125
  },
  {
    month: 'December',
    published: 0,
    inProgress: 10,
    cancelled: 5,
    finished: 80,
    completed: 70,
    eventAmount: 110,
    searchAmount: 140
  }
]);

const topAssets = ref([
  { month: 'January', marca1: 80, marca2: 0, marca3: 0, marca4: 0, marca5: -20 },
  { month: 'February', marca1: 0, marca2: 60, marca3: 0, marca4: -40, marca5: -30 },
  { month: 'March', marca1: -30, marca2: 40, marca3: 0, marca4: 0, marca5: 0 },
  { month: 'April', marca1: 50, marca2: 20, marca3: 10, marca4: 0, marca5: -10 },
  { month: 'May', marca1: 60, marca2: -20, marca3: 30, marca4: 0, marca5: -5 },
  { month: 'June', marca1: 40, marca2: 50, marca3: 0, marca4: -10, marca5: 20 },
  { month: 'July', marca1: 30, marca2: 60, marca3: -10, marca4: 10, marca5: 0 },
  { month: 'August', marca1: 20, marca2: 50, marca3: 10, marca4: 20, marca5: 0 },
  { month: 'September', marca1: 70, marca2: -10, marca3: 30, marca4: 0, marca5: 10 },
  { month: 'October', marca1: 10, marca2: 40, marca3: 20, marca4: 0, marca5: 30 },
  { month: 'November', marca1: 80, marca2: 10, marca3: 0, marca4: -20, marca5: 5 },
  { month: 'December', marca1: 90, marca2: 30, marca3: 0, marca4: 0, marca5: -10 }
]);

const avgOffers = ref([
  { month: 'January', confirmedAvg: 70, totalAvg: 60 },
  { month: 'February', confirmedAvg: 60, totalAvg: 40 },
  { month: 'March', confirmedAvg: 50, totalAvg: 45 },
  { month: 'April', confirmedAvg: 65, totalAvg: 55 },
  { month: 'May', confirmedAvg: 55, totalAvg: 50 },
  { month: 'June', confirmedAvg: 60, totalAvg: 57 },
  { month: 'July', confirmedAvg: 70, totalAvg: 65 },
  { month: 'August', confirmedAvg: 75, totalAvg: 68 },
  { month: 'September', confirmedAvg: 80, totalAvg: 72 },
  { month: 'October', confirmedAvg: 60, totalAvg: 55 },
  { month: 'November', confirmedAvg: 85, totalAvg: 77 },
  { month: 'December', confirmedAvg: 90, totalAvg: 80 }
]);

// Variables para el modal
const isModalOpen = ref(false)
const selectedChartIndex = ref<number | null>(null)
const modalChartId = 'modal-chart'
let modalChart: Chart | null = null

interface ChartConfig {
  id: string
  title: string
  createConfig: (data: any) => Chart.ChartConfiguration
}
const chartConfigs: ChartConfig[] = [
  {
    id: 'eventsChart',
    title: 'Eventos por mes',
    createConfig: () => ({
      type: 'bar',
      data: {
        labels: monthlyData.value.map(data => data.month),
        datasets: [
          {
            label: 'Publicado',
            data: monthlyData.value.map(data => data.published),
            backgroundColor: '#FFC8CB',
            borderColor: '#F6313C',
            stack: 'Stack 0',
          },
          {
            label: 'En curso',
            data: monthlyData.value.map(data => data.inProgress),
            backgroundColor: '#60A5FA',
            borderColor: '#388EBF',
            stack: 'Stack 0',
          },
          {
            label: 'Cancelado',
            data: monthlyData.value.map(data => data.cancelled),
            backgroundColor: '#00BB8E',
            stack: 'Stack 0',
          },
          {
            label: 'Finalizado',
            data: monthlyData.value.map(data => data.finished),
            backgroundColor: '#FBBF24',
            stack: 'Stack 0',
          },
          {
            label: 'Culminado',
            data: monthlyData.value.map(data => data.completed),
            backgroundColor: '#788EB9',
            stack: 'Stack 0',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            min: -100,
            max: 150,
            stacked: true
          },
          x: {
            stacked: true
          }
        }
      }
    })
  },
  {
    id: 'amountChart',
    title: 'Monto recaudado por mes',
    createConfig: () => ({
      type: 'line',
      data: {
        labels: monthlyData.value.map(data => data.month),
        datasets: [
          {
            label: 'Suma de Montos por evento',
            data: monthlyData.value.map(data => data.eventAmount),
            borderColor: '#F6313C',
            backgroundColor: '#FFC8CB',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Suma de Montos de buscadores de eventos',
            data: monthlyData.value.map(data => data.searchAmount),
            borderColor: '#60A5FA',
            backgroundColor: '#C7E0F0',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function(value) {
                return '$ ' + value;
              }
            }
          }
        }
      }
    })
  },
  {
    id: 'assetsChart',
    title: 'Top 5 sub tipo de bienes',
    createConfig: () => ({
      type: 'bar',
      data: {
        labels: topAssets.value.map(asset => asset.month),
        datasets: [
          {
            label: 'Marca 1',
            data: topAssets.value.map(asset => asset.marca1),
            backgroundColor: '#FFC8CB',
            borderColor: '#F6313C',
            borderWidth: 2
          },
          {
            label: 'Marca 2',
            data: topAssets.value.map(asset => asset.marca2),
            backgroundColor: '#C7E0F0',
            borderColor: '#60A5FA',
            borderWidth: 2
          },
          {
            label: 'Marca 3',
            data: topAssets.value.map(asset => asset.marca3),
            backgroundColor: '#A0FAD9',
            borderColor: '#00BB8E',
            borderWidth: 2
          },
          {
            label: 'Marca 4',
            data: topAssets.value.map(asset => asset.marca4),
            backgroundColor: '#FEF484',
            borderColor: '#FBBF24',
            borderWidth: 2
          },
          {
            label: 'Marca 5',
            data: topAssets.value.map(asset => asset.marca5),
            backgroundColor: '#D7DFEB',
            borderColor: '#788EB9',
            borderWidth: 2
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: -60,
            max: 100,
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    })
  },
  {
    id: 'avgOffersChart',
    title: 'Valor promedio de ofertas',
    createConfig: () => ({
      type: 'line',
      data: {
        labels: avgOffers.value.map(data => data.month),
        datasets: [
          {
            label: 'Promedio de montos de oferta en estado Abono confirmado',
            data: avgOffers.value.map(data => data.confirmedAvg),
            borderColor: '#F6313C',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Sumatoria de ofertas con estado Abono confirmado',
            data: avgOffers.value.map(data => data.totalAvg),
            borderColor: '#60A5FA',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
          Legend:{
            position:'botton',
            labels:{
              size:10
            },
            boxWidth:12,
            padding:8,
            wrap: true
          }
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
            ticks: {
              callback: function(value) {
                return '$ ' + value;
              }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 60,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    })
  }
]

//Funciones para el modal
const openChartModal = async (index: number) => {
  selectedChartIndex.value = index
  isModalOpen.value = true

  await nextTick()
  const ctx = document.getElementById(modalChartId) as HTMLCanvasElement
  if (ctx && selectedChartIndex.value !== null) {
    if (modalChart) {
      modalChart.destroy()
    }
    const config = chartConfigs[selectedChartIndex.value]
    modalChart = new Chart(ctx, config.createConfig(null))
  }
}

const closeModal = () => {
  isModalOpen.value = false
  if (modalChart) {
    modalChart.destroy()
    modalChart = null
  }
}
onMounted(() => {
  // Inicializar los gráficos originales
  chartConfigs.forEach((config) => {
    const ctx = document.getElementById(config.id) as HTMLCanvasElement
    if (ctx) {
      new Chart(ctx, config.createConfig(null))
    }
  })
})
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
    <div
      v-for="(config, index) in chartConfigs"
      :key="config.id"
      class="bg-white shadow rounded-lg p-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">{{ config.title }}</h2>
        <button @click="openChartModal(index)">
          <CustomIcons name="icon-vector"  class="w-4 h-4" />
        </button>
      </div>
      <div class="w-full h-64 sm:h-80">
        <canvas :id="config.id"></canvas>
      </div>
    </div>

  </div>

  <ChartModal
    :is-open="isModalOpen"
    :title="selectedChartIndex !== null ? chartConfigs[selectedChartIndex].title : ''"
    :modal-chart-id="modalChartId"
    @close="closeModal"
  />
</template>

