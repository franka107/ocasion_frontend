<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import {
  Chart,
  registerables,
  type ChartDataset,
  type ChartData,
  type ChartOptions,
  type ChartType,
} from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  chartId: string
  chartType: ChartType
  chartData: ChartData
  chartOptions?: ChartOptions
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const renderChart = () => {
  if (chartInstance) chartInstance.destroy() // Destruir instancia previa
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: props.chartType, // Cambia según el tipo de gráfico
      data: props.chartData,
      options: props.chartOptions,
    })
  }
}

onMounted(renderChart)
watch(() => props.chartData, renderChart, { deep: true })
</script>

<template>
  <canvas :id="chartId" ref="chartCanvas"></canvas>
</template>
